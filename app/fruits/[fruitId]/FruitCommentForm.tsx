'use client';

import { useState } from 'react';
import type { Fruit } from '../../../database/fruits';
import { createOrUpdateCookie } from './actions';

type Props = {
  fruitId: Fruit['id'];
};

export default function FruitCommentForm(props: Props) {
  const [comment, setComment] = useState('');

  // // If you want to use a separate handleChange function,
  // // the `event` can be typed like this
  // function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
  //   setComment(event.currentTarget.value)
  // }

  return (
    <form>
      <textarea
        value={comment}
        onChange={(event) => {
          setComment(event.currentTarget.value);
        }}
        // onChange={handleChange}
      />
      <button formAction={() => createOrUpdateCookie(props.fruitId, comment)}>
        Add comment
      </button>
    </form>
  );
}
