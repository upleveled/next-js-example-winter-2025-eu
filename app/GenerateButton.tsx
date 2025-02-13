'use client';

// DONT DO THIS!!
// DONT USE document.cookie in Next.js!

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GenerateButton() {
  const [color, setColor] = useState('#fff');

  const router = useRouter();

  // access external sources with useEffect!
  useEffect(() => {
    // DONT DO THIS!!
    // DONT USE document.cookie in Next.js!
    const allCookies = document.cookie;

    // We get all cookies, and find the cookie with name buttonColor
    const buttonColor = allCookies
      .split('; ')
      .find((row) => row.startsWith('buttonColor='))
      ?.split('=')[1];

    setColor(
      buttonColor || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    );
  }, []);

  return (
    <button
      style={{ backgroundColor: color }}
      onClick={() => {
        const newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        document.cookie = `buttonColor=${newColor}`;
        setColor(newColor);
        router.refresh();
      }}
    >
      generate
    </button>
  );
}
