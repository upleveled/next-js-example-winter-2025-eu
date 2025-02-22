import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getAnimalsFoodsInsecure,
  getAnimalWithFoodsInsecure,
} from '../../../../database/animals';
import { reduceAnimalsWithFoods } from '../../../../util/dataStructure';

type Props = {
  params: Promise<{
    animalId: string;
  }>;
};

export default async function AnimalFoodPage(props: Props) {
  const animalsFoods = await getAnimalsFoodsInsecure(
    Number((await props.params).animalId),
  );

  const animalWithFoodsArray = await getAnimalWithFoodsInsecure(
    Number((await props.params).animalId),
  );

  if (!animalsFoods[0] || !animalWithFoodsArray) {
    notFound();
  }

  console.log(animalsFoods);

  const animalWithFoods = reduceAnimalsWithFoods(animalsFoods);

  console.log(animalWithFoods);

  return (
    <div>
      <h1>
        {animalWithFoods.firstName} (using data transformation in JavaScript)
      </h1>
      <Image
        src={`/images/${animalWithFoods.firstName.toLowerCase()}.webp`}
        alt={`A picture of ${animalWithFoods.firstName}`}
        width={200}
        height={200}
      />
      <p>
        This is a {animalWithFoods.type} carrying a {animalWithFoods.accessory}
      </p>
      <br />
      Who likes:
      <ul>
        {animalWithFoods.animalFoods.map((animalFood) => {
          return (
            <li key={`animal-with-foods-${animalFood.name}-${animalFood.id}`}>
              {animalFood.name}
            </li>
          );
        })}
      </ul>
      <br />
      <br />
      {/* The JSON AGG starts */}
      <br />
      <h1>
        {animalWithFoodsArray.animalFirstName} (using data transformation in SQL
        - using json_agg)
      </h1>
      <Image
        src={`/images/${animalWithFoodsArray.animalFirstName.toLowerCase()}.webp`}
        alt={`A picture of ${animalWithFoodsArray.animalFirstName}`}
        width={200}
        height={200}
      />
      <p>
        This is a {animalWithFoodsArray.animalType} carrying a{' '}
        {animalWithFoodsArray.animalAccessory}
      </p>
      <br />
      Who likes:
      <ul>
        {animalWithFoodsArray.animalFoods.map((animalFood) => {
          return (
            <li key={`animal-with-food-${animalFood.name}-${animalFood.id}`}>
              {animalFood.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
