import { notFound } from 'next/navigation';
import { deleteAnimalInsecure } from '../../../../database/animals';

type Props = {
  params: Promise<{
    animalId: string;
  }>;
};

export default async function AnimalNaiveDeletePage(props: Props) {
  const animal = await deleteAnimalInsecure({
    id: Number((await props.params).animalId),
  });

  if (!animal) {
    notFound();
  }

  return (
    <div>
      Animal with id {animal.id} and first name {animal.firstName} Deleted
    </div>
  );
}
