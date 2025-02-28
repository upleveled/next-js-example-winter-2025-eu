import { cache } from 'react';
import type { Session } from '../migrations/00007-createTableSessions';
import type { Note } from '../migrations/00008-createTableNotes';
import { sql } from './connect';

export const getNotes = cache(async (sessionToken: Session['token']) => {
  const notes = await sql<Note[]>`
    SELECT
      notes.*
    FROM
      notes
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND sessions.user_id = notes.user_id
      )
  `;

  return notes;
});

export const getNote = cache(async (sessionToken: string, noteId: number) => {
  const [note] = await sql<Note[]>`
    SELECT
      notes.*
    FROM
      notes
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND expiry_timestamp > now()
        AND sessions.user_id = notes.user_id
      )
    WHERE
      notes.id = ${noteId}
  `;
  return note;
});

export async function selectNoteExists(noteId: Note['id']) {
  const [record] = await sql<{ exists: boolean }[]>`
    SELECT
      EXISTS (
        SELECT
          TRUE
        FROM
          notes
        WHERE
          id = ${noteId}
      )
  `;

  return Boolean(record?.exists);
}

export const createNote = cache(
  async (
    sessionToken: Session['token'],
    newNote: Omit<Note, 'id' | 'userId'>,
  ) => {
    const [note] = await sql<Pick<Note, 'id' | 'textContent'>[]>`
      INSERT INTO
        notes (title, text_content, user_id) (
          SELECT
            ${newNote.title},
            ${newNote.textContent},
            sessions.user_id
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        notes.id,
        notes.text_content
    `;

    return note;
  },
);
