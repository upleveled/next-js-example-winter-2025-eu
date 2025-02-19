import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createAnimalInsecure,
  getAnimalsInsecure,
} from '../../../database/animals';
import type { Animal } from '../../../migrations/00000-createTableAnimals';

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

export const animalSchema = z.object({
  firstName: z.string(),
  type: z.string(),
  accessory: z.string().optional(),
  // accessory: z.string().nullable()
  // birthdate: z.date(), wrong
  // We can use coerce method to convert the string to a date
  birthDate: z.coerce.date(),
});

// WARNING: You don't need this, because in Next.js
// you can use database queries directly in Server Components
export async function GET(): Promise<NextResponse<AnimalsResponseBodyGet>> {
  const animals = await getAnimalsInsecure();
  return NextResponse.json({ animals: animals });
}

export async function POST(
  request: Request,
): Promise<NextResponse<AnimalsResponseBodyPost>> {
  const requestBody = await request.json();

  const result = animalSchema.safeParse(requestBody);

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
