import { cache } from 'react';
import { sql } from '../database/connect';
import type { Animal } from '../migrations/00000-createTableAnimals';
import type {
  AnimalsFoods,
  AnimalWithFoods,
} from '../migrations/00004-createTableAnimalFoods';
import type { Session } from '../migrations/00007-createTableSessions';

// This is coming from the database now
// const animals = [
// {
//   id: 1,
//   firstName: 'Lucia',
//   type: 'Cat',
//   accessory: 'House',
//   birthDate: new Date('1999-06-23'),
// },
// {
//   id: 2,
//   firstName: 'Bili',
//   type: 'Capybaras',
//   accessory: 'Car',
//   birthDate: new Date('2020-06-23'),
// },
// {
//   id: 3,
//   firstName: 'Jojo',
//   type: 'Dog',
//   accessory: 'Bike',
//   birthDate: new Date('2020-06-23'),
// },
// {
//   id: 4,
//   firstName: 'Macca',
//   type: 'Elephant',
//   accessory: 'Key',
//   birthDate: new Date('2020-06-23'),
// },
// {
//   id: 5,
//   firstName: 'Fro',
//   type: 'Duck',
//   accessory: 'Motor',
//   birthDate: new Date('2020-06-23'),
// },
// ];

// export function getAnimals() {
//   // return animals
// }

// export function getAnimal(id) {
//   // return animals.find((animal) => animal.id === id);
// }

// Secure database queries start here
// All queries not marked `Insecure` use session tokens to authenticate the user

export const getAnimals = cache(async (sessionToken: Session['token']) => {
  const animals = await sql<Animal[]>`
    SELECT
      animals.*
    FROM
      animals
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
      )
  `;

  return animals;
});

export const createAnimal = cache(
  async (sessionToken: Session['token'], newAnimal: Omit<Animal, 'id'>) => {
    const [animal] = await sql<Animal[]>`
      INSERT INTO
        animals (
          first_name,
          type,
          accessory,
          birth_date
        ) (
          SELECT
            ${newAnimal.firstName},
            ${newAnimal.type},
            ${newAnimal.accessory},
            ${newAnimal.birthDate}
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        animals.*
    `;

    return animal;
  },
);

export const updateAnimal = cache(
  async (sessionToken: Session['token'], updatedAnimal: Animal) => {
    const [animal] = await sql<Animal[]>`
      UPDATE animals
      SET
        first_name = ${updatedAnimal.firstName},
        type = ${updatedAnimal.type},
        accessory = ${updatedAnimal.accessory},
        birth_date = ${updatedAnimal.birthDate}
      FROM
        sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND animals.id = ${updatedAnimal.id}
      RETURNING
        animals.*
    `;
    return animal;
  },
);

export const deleteAnimal = cache(
  async (sessionToken: Session['token'], id: number) => {
    const [animal] = await sql<Animal[]>`
      DELETE FROM animals USING sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND animals.id = ${id}
      RETURNING
        animals.*
    `;

    return animal;
  },
);

// Insecure database queries start here
// All queries marked `Insecure` do not use session tokens to authenticate the user

export const getAnimalsInsecure = cache(async () => {
  const animals = await sql<Animal[]>`
    SELECT
      *
    FROM
      animals
  `;

  return animals;
});

export const getAnimalInsecure = cache(async (id: number) => {
  const [animal] = await sql<Animal[]>`
    SELECT
      *
    FROM
      animals
    WHERE
      id = ${id}
  `;

  return animal;
});

export const getAnimalsFoodsInsecure = cache(async (id: number) => {
  const animalsFoods = await sql<AnimalsFoods[]>`
    SELECT
      animals.id AS animal_id,
      animals.first_name AS animal_first_name,
      animals.type AS animal_type,
      animals.accessory AS animal_accessory,
      animals.birth_date AS animal_birth_date,
      foods.id AS animal_food_id,
      foods.name AS animal_food_name,
      foods.type AS animal_food_type
    FROM
      animals
      LEFT JOIN animals_foods ON animals.id = animals_foods.animal_id
      LEFT JOIN foods ON animals_foods.food_id = foods.id
    WHERE
      animals.id = ${id}
  `;

  return animalsFoods;
});

export const getAnimalWithFoodsInsecure = cache(async (id: number) => {
  const [animal] = await sql<AnimalWithFoods[]>`
    SELECT
      animals.id AS animal_id,
      animals.first_name AS animal_first_name,
      animals.type AS animal_type,
      animals.accessory AS animal_accessory,
      -- Return empty array instead of [null] if no food is found
      coalesce(
        json_agg(foods.*) FILTER (
          WHERE
            foods.id IS NOT NULL
        ),
        '[]'
      ) AS animal_foods
    FROM
      animals
      LEFT JOIN animals_foods ON animals.id = animals_foods.animal_id
      LEFT JOIN foods ON foods.id = animals_foods.food_id
    WHERE
      animals.id = ${id}
    GROUP BY
      animals.first_name,
      animals.type,
      animals.accessory,
      animals.id
  `;

  return animal;
});

export const createAnimalInsecure = cache(
  async (newAnimal: Omit<Animal, 'id'>) => {
    const [animal] = await sql<Animal[]>`
      INSERT INTO
        animals (
          first_name,
          type,
          accessory,
          birth_date
        )
      VALUES
        (
          ${newAnimal.firstName},
          ${newAnimal.type},
          ${newAnimal.accessory},
          ${newAnimal.birthDate}
        )
      RETURNING
        animals.*
    `;

    return animal;
  },
);

export const updateAnimalInsecure = cache(async (updatedAnimal: Animal) => {
  const [animal] = await sql<Animal[]>`
    UPDATE animals
    SET
      first_name = ${updatedAnimal.firstName},
      type = ${updatedAnimal.type},
      accessory = ${updatedAnimal.accessory},
      birth_date = ${updatedAnimal.birthDate}
    WHERE
      id = ${updatedAnimal.id}
    RETURNING
      animals.*
  `;

  return animal;
});

export const deleteAnimalInsecure = cache(
  async (deletedAnimal: Pick<Animal, 'id'>) => {
    const [animal] = await sql<Animal[]>`
      DELETE FROM animals
      WHERE
        id = ${deletedAnimal.id}
      RETURNING
        animals.*
    `;

    return animal;
  },
);
