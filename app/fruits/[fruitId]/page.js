import { notFound } from 'next/navigation';
import React from 'react';
import { getFruit } from '../../../database/fruits';
import { getCookie } from '../../../util/cookies';
import { parseJson } from '../../../util/json';
import FruitCommentForm from './FruitCommentForm';

export default async function SingleFruitsPage(props) {
  const fruit = getFruit(Number((await props.params).fruitId));

  if (!fruit) {
    notFound();
  }

  const fruitCommentsCookie = getCookie('fruitComments');

  let fruitComments = parseJson(fruitCommentsCookie) || [];

  if (!Array.isArray(fruitComments)) {
    fruitComments = [];
  }

  const fruitCommentToDisplay = fruitComments.find((fruitComment) => {
    return fruitComment.id === fruit.id;
  });

  return (
    <>
      <h1>
        {fruit.name} {fruit.icon}
      </h1>
      <div>{fruitCommentToDisplay?.comment}</div>
      <FruitCommentForm fruitId={fruit.id} />
    </>
  );
}
