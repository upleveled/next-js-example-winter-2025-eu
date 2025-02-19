import { NextResponse } from 'next/server';
import { z } from 'zod';

export type RootResponseBodyGet =
  | {
      animals: string;
    }
  | {
      error: string;
    };

const userSchema = z.object({
  name: z.string(),
});

export function GET(): NextResponse<RootResponseBodyGet> {
  return NextResponse.json({ animals: '/api/animals' });
}

export async function POST(
  request: Request,
): Promise<NextResponse<RootResponseBodyGet>> {
  const requestBody = await request.json();

  const result = userSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      {
        error:
          'You need to send an object with name property, e.g. {"name": "Karl"}',
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json({ animals: '/api/animals' });
}
