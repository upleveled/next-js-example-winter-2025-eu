import type { Sql } from 'postgres';
import { z } from 'zod';
import type { User } from './00006-createTableUsers';

export type Note = {
  id: number;
  title: string;
  textContent: string;
  userId: User['id'];
};

export const noteSchema = z.object({
  title: z.string().min(3).max(100),
  textContent: z.string().min(10),
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE notes (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title varchar(100) NOT NULL UNIQUE,
      text_content text NOT NULL,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE notes`;
}
