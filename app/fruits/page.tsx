import Link from 'next/link';
import React from 'react';
import { getFruits } from '../../database/fruits';
import { getCookie } from '../../util/cookies';
import { parseJson } from '../../util/json';

export default async function Fruits() {
  const fruits = getFruits();

  const fruitCommentsCookie = await getCookie('fruitComments');

  let fruitComments = parseJson(fruitCommentsCookie) || [];

  if (!Array.isArray(fruitComments)) {
    fruitComments = [];
  }

  return (
    <>
      <h1>Fruits Page</h1>
      {fruits.map((fruit) => {
        const fruitComment = fruitComments.find(
          (fruitObject) => fruit.id === fruitObject.id,
        );

        return (
          <div key={`fruit-${fruit.id}`}>
            <Link href={`/fruits/${fruit.id}`}>
              <h2>
                {fruit.name} {fruit.icon}
              </h2>
            </Link>
            <div>{fruitComment?.comment}</div>
          </div>
        );
      })}
    </>
  );
}
