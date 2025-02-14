import { expect, test } from '@jest/globals';
import { reduceAnimalsWithFoods } from '../dataStructure';

test('reduce anima favorite food', () => {
  const animalBirthDate = new Date();
  const animalFoods = [
    {
      animalId: 1,
      animalFirstName: 'Lucia',
      animalType: 'Cat',
      animalAccessory: 'House',
      animalBirthDate: animalBirthDate,
      animalFoodId: 3,
      animalFoodName: 'Rice',
      animalFoodType: 'Grain',
    },
    {
      animalId: 1,
      animalFirstName: 'Lucia',
      animalType: 'Cat',
      animalAccessory: 'House',
      animalBirthDate: animalBirthDate,
      animalFoodId: 4,
      animalFoodName: 'Mango',
      animalFoodType: 'Fruit',
    },
  ];

  const reducedAnimalFoods = {
    id: 1,
    firstName: 'Lucia',
    type: 'Cat',
    accessory: 'House',
    birthDate: animalBirthDate,
    animalFoods: [
      { id: 3, name: 'Rice', type: 'Grain' },
      { id: 4, name: 'Mango', type: 'Fruit' },
    ],
  };

  expect(reduceAnimalsWithFoods(animalFoods)).toStrictEqual(reducedAnimalFoods);
});
