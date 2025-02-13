'use server';

import { cookies } from 'next/headers';
import type { Fruit } from '../../../database/fruits';
import { getCookie } from '../../../util/cookies';
import { parseJson } from '../../../util/json';

// Case A: cookie is undefined (not set)
// Case B: cookie set, id doesn't exist
// Case C: cookie set, id exists already

export type FruitComment = {
  id: number;
  comment: string;
};

export async function createOrUpdateCookie(
  fruitId: Fruit['id'],
  comment: FruitComment['comment'],
) {
  // 1. get current cookie
  const fruitsCommentsCookie = await getCookie('fruitComments');

  // 2. parse the cookie value
  const fruitComments =
    fruitsCommentsCookie === 'undefined'
      ? // Case A: cookie is undefined
        []
      : (parseJson(fruitsCommentsCookie) as FruitComment[] | undefined) || [];

  // 3. find cookie value
  const fruitToUpdate = fruitComments.find((fruitComment) => {
    return fruitComment.id === fruitId;
  });

  if (!fruitToUpdate) {
    fruitComments.push({
      id: fruitId,
      comment: comment,
    });
  } else {
    fruitToUpdate.comment = comment;
  }

  (await cookies()).set('fruitComments', JSON.stringify(fruitComments));
}
