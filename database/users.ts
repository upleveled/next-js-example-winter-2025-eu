import { cache } from 'react';
import type { User } from '../migrations/00006-createTableUsers';
import { sql } from './connect';

type UserWithPasswordHash = User & {
  passwordHash: string;
};

export const getUserInsecure = cache(async (username: User['username']) => {
  const [user] = await sql<User[]>`
    SELECT
      users.id,
      users.username
    FROM
      users
    WHERE
      username = ${username}
  `;

  return user;
});

export const getUserWithPasswordHashInsecure = cache(
  async (username: User['username']) => {
    const [user] = await sql<UserWithPasswordHash[]>`
      SELECT
        users.*
      FROM
        users
      WHERE
        username = ${username.toLowerCase()}
    `;

    return user;
  },
);

export const createUserInsecure = cache(
  async (
    username: User['username'],
    passwordHash: UserWithPasswordHash['passwordHash'],
  ) => {
    const [user] = await sql<User[]>`
      INSERT INTO
        users (username, password_hash)
      VALUES
        (
          ${username.toLowerCase()},
          ${passwordHash}
        )
      RETURNING
        users.id,
        users.username
    `;

    return user;
  },
);
