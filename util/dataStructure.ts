import type { AnimalsFoods } from '../migrations/00004-createTableAnimalFoods';

export function reduceAnimalsWithFoods(animalsFoods: AnimalsFoods[]) {
  const animal = animalsFoods[0];

  if (!animal) {
    throw new Error('No animal found!');
  }

  const animalWithFoods = {
    id: animal.animalId,
    firstName: animal.animalFirstName,
    type: animal.animalType,
    accessory: animal.animalAccessory,
    birthDate: animal.animalBirthDate,
    animalFoods: animalsFoods.map((animalFood) => {
      return {
        id: animalFood.animalFoodId,
        name: animalFood.animalFoodName,
        type: animalFood.animalFoodType,
      };
    }),
  };
  return animalWithFoods;
}
