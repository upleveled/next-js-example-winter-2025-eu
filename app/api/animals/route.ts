import { NextResponse } from 'next/server';
import {
  createAnimalInsecure,
  getAnimalsInsecure,
} from '../../../database/animals';
import {
  type Animal,
  animalSchema,
} from '../../../migrations/00000-createTableAnimals';

export type AnimalsResponseBodyGet = {
  animals: Animal[];
};

export type AnimalsResponseBodyPost =
  | {
      animal: Animal;
    }
  | {
      error: string;
    };

// WARNING: You don't need this, because in Next.js
// you can use database queries directly in Server Components
export async function GET(): Promise<NextResponse<AnimalsResponseBodyGet>> {
  const animals = await getAnimalsInsecure();
  return NextResponse.json({ animals: animals });
}

export async function POST(
  request: Request,
): Promise<NextResponse<AnimalsResponseBodyPost>> {
  // get body from client and parse it
  const requestBody = await request.json();

  // validate information from client
  const result = animalSchema.safeParse(requestBody);

  // If client sends request body with incorrect data,
  // return a response with a 400 status code to the client
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain animal object',
      },
      { status: 400 },
    );
  }

  const newAnimal = await createAnimalInsecure({
    firstName: result.data.firstName,
    type: result.data.type,
    accessory: result.data.accessory || null,
    birthDate: result.data.birthDate,
  });

  if (!newAnimal) {
    return NextResponse.json(
      {
        error: 'Animal not created or access denied creating animal',
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({ animal: newAnimal });
}
