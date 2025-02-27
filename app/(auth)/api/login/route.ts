import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSessionInsecure } from '../../../../database/sessions';
import { getUserWithPasswordHashInsecure } from '../../../../database/users';
import {
  type User,
  userSchema,
} from '../../../../migrations/00006-createTableUsers';
import { secureCookieOptions } from '../../../../util/cookies';

export type LoginResponseBody =
  | {
      user: { username: User['username'] };
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: Request,
): Promise<NextResponse<LoginResponseBody>> {
  // Task: Implement the user login workflow

  // 1. Get the user data from the request
  const requestBody = await request.json();

  // 2. Validate the user data with zod
  const result = userSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.issues },
      {
        status: 400,
      },
    );
  }

  // 3. Verify the user credentials
  const userWithPasswordHash = await getUserWithPasswordHashInsecure(
    result.data.username,
  );

  console.log('userWithPasswordHash', userWithPasswordHash);

  if (!userWithPasswordHash) {
    return NextResponse.json(
      {
        errors: [{ message: 'Username or Password is invalid' }],
      },
      {
        status: 400,
      },
    );
  }

  // 4. Validate the user password by comparing with hashed password
  const isPasswordValid = await bcrypt.compare(
    result.data.password,
    userWithPasswordHash.passwordHash,
  );

  if (!isPasswordValid) {
    return NextResponse.json(
      {
        errors: [{ message: 'Username or Password is invalid' }],
      },
      {
        status: 400,
      },
    );
  }

  // At this stage we already confirm that the user is who they say they are

  // 5. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  // 6. Create the session record
  const session = await createSessionInsecure(token, userWithPasswordHash.id);

  if (!session) {
    return NextResponse.json(
      {
        errors: [{ message: 'Session creation failed' }],
      },
      {
        status: 400,
      },
    );
  }

  // 7. Send the new cookie in the headers

  // (await cookies()).set({
  //   name: 'sessionToken',
  //   value: session.token,
  //   httpOnly: true,
  //   path: '/',
  //   maxAge: 60 * 60 * 24, // Expires 24 hours
  //   sameSite: 'lax',
  //   secure: true,
  // });

  (await cookies()).set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  // 8. Return the new user information
  return NextResponse.json({
    user: {
      username: userWithPasswordHash.username,
    },
  });
}
