import Image from 'next/image';
import { getAnimal } from '../../../database/animals';

export async function generateMetadata(props) {
  const singleAnimal = getAnimal(Number((await props.params).animalId));

  return {
    title: singleAnimal.firstName,
    description: 'This is my single animal page ',
  };
}

export default async function AnimalPage(props) {
  const singleAnimal = getAnimal(Number((await props.params).animalId));

  const currentDate = new Date();

  // Create new date object to avoid mutating the original birth date
  const nextBirthDate = new Date(singleAnimal.birthDate);

  // Set birth date year to current year
  nextBirthDate.setUTCFullYear(currentDate.getFullYear());

  // Set UTC time to 0 to compare only days (avoid time zones)
  currentDate.setUTCHours(0, 0, 0, 0);
  nextBirthDate.setUTCHours(0, 0, 0, 0);

  if (nextBirthDate.getTime() < currentDate.getTime()) {
    nextBirthDate.setUTCFullYear(currentDate.getFullYear() + 1);
  }
  const daysUntilNextBirthDay =
    (nextBirthDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);

  return (
    <div>
      <h1>{singleAnimal.firstName}</h1>
      <div>
        Birth Date:{' '}
        {singleAnimal.birthDate.toLocaleDateString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </div>
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
