import type { Sql } from 'postgres';

const animalsFoods = [
  { id: 1, animalId: 1, foodId: 4 },
  { id: 2, animalId: 5, foodId: 2 },
  { id: 3, animalId: 1, foodId: 3 },
  { id: 4, animalId: 2, foodId: 5 },
  { id: 5, animalId: 2, foodId: 1 },
];

export async function up(sql: Sql) {
  for (const animalFood of animalsFoods) {
    await sql`
      INSERT INTO
        animals_foods (animal_id, food_id)
      VALUES
        (
          ${animalFood.animalId},
          ${animalFood.foodId}
        )
    `;
  }
}

export async function down(sql: Sql) {
  for (const animalFood of animalsFoods) {
    await sql`
      DELETE FROM animals_foods
      WHERE
        id = ${animalFood.id}
    `;
  }
}
