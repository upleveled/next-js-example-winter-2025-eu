import { NextRequest, NextResponse } from 'next/server';
import {
  deleteAnimalInsecure,
  getAnimalInsecure,
  updateAnimalInsecure,
} from '../../../../database/animals';
import {
  type Animal,
  animalSchema,
} from '../../../../migrations/00000-createTableAnimals';

export type AnimalResponseBodyGet =
  | {
      animal: Animal;
    }
  | {
      error: string;
    };

type AnimalParams = {
  params: {
    animalId: string;
  };
};

// WARNING: You don't need this, because in Next.js
// you can use database queries directly in Server Components
export async function GET(
  request: NextRequest,
  { params }: AnimalParams,
): Promise<NextResponse<AnimalResponseBodyGet>> {
  const animal = await getAnimalInsecure(Number(params.animalId));

  if (!animal) {
    return NextResponse.json(
      {
        error: 'Animal does not exist',
      },
      { status: 404 },
    );
  }
  return NextResponse.json({ animal: animal });
}

export type AnimalResponseBodyDelete =
  | {
      animal: Animal;
    }
  | { error: string };

export async function DELETE(
  request: NextRequest,
  { params }: AnimalParams,
): Promise<NextResponse<AnimalResponseBodyDelete>> {
  const animal = await deleteAnimalInsecure({
    id: Number(params.animalId),
  });

  if (!animal) {
    return NextResponse.json(
      {
        error: 'Animal does not exist',
      },
      { status: 404 },
    );
  }
  return NextResponse.json({ animal: animal });
}

export type AnimalResponseBodyPut =
  | {
      animal: Animal;
    }
  | {
      error: string;
    };

export async function PUT(
  request: Request,
  { params }: AnimalParams,
): Promise<NextResponse<AnimalResponseBodyPut>> {
  const requestBody = await request.json();

  const result = animalSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain animal object',
        errorIssues: result.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  const updatedAnimal = await updateAnimalInsecure({
    id: Number(params.animalId),
    firstName: result.data.firstName,
    type: result.data.type,
    accessory: result.data.accessory || null,
    birthDate: result.data.birthDate,
  });

  if (!updatedAnimal) {
    return NextResponse.json(
      {
        error: 'Animal not found or access denied updating animal',
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    animal: updatedAnimal,
  });
}
