import { notFound } from 'next/navigation';
import { updateAnimalInsecure } from '../../../../database/animals';

// ?firstName=Luka&type=Dog&accessory=Bike&birthDate=1990-06-23
export default async function AnimalNaiveUpdatePage(props) {
  const animalSearchParams = await props.searchParams;

  const animal = await updateAnimalInsecure({
    id: Number((await props.params).animalId),
    firstName: animalSearchParams.firstName,
    type: animalSearchParams.type,
    accessory: animalSearchParams.accessory,
    birthDate: new Date(animalSearchParams.birthDate),
  });

  if (!animal) {
    notFound();
  }

  return (
    <div>
      Animal with id {animal.id} updated with new name {animal.firstName}
    </div>
  );
}
