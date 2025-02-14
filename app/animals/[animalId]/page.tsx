import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAnimalInsecure } from '../../../database/animals';
import { formatDate, getDaysUntilNextBirthDay } from '../../../util/date';

export async function generateMetadata(props: Props) {
  const singleAnimal = await getAnimalInsecure(
    Number((await props.params).animalId),
  );

  if (!singleAnimal) {
    notFound();
  }

  return {
    title: singleAnimal.firstName,
    description: 'This is my single animal page ',
  };
}

type Props = {
  params: Promise<{
    animalId: string;
  }>;
};

export default async function AnimalPage(props: Props) {
  const singleAnimal = await getAnimalInsecure(
    Number((await props.params).animalId),
  );

  if (!singleAnimal) {
    notFound();
  }

  const currentDate = new Date();

  // Create new date object to avoid mutating the original birth date
  const nextBirthDate = new Date(singleAnimal.birthDate);

  const daysUntilNextBirthDay = getDaysUntilNextBirthDay(
    currentDate,
    nextBirthDate,
  );

  return (
    <div>
      <h1>{singleAnimal.firstName}</h1>
      <div>Birth Date: {formatDate(singleAnimal.birthDate)}</div>
      <div>Days left until birthday: {daysUntilNextBirthDay}</div>
      <Image
        src={`/images/${singleAnimal.firstName.toLowerCase()}.webp`}
        alt={singleAnimal.firstName}
        width={300}
        height={300}
      />
      this is {singleAnimal.type} that has {singleAnimal.accessory}
    </div>
  );
}
