'use client';

import { useEffect, useState } from 'react';

export default function LocalStorage() {
  // Pass in generic type argument to useState
  // to allow different types on state variable
  const [darkMode, setDarkMode] = useState<string | null>('');

  useEffect(() => {
    // window.localStorage.setItem('darkMode', true);
    // window.localStorage.removeItem('darkMode');

    const localStorageDarkMode = window.localStorage.getItem('darkMode');

    setDarkMode(localStorageDarkMode);
    // // Alternative solution
    // setDarkMode(localStorageDarkMode || '');
  }, []);

  return <div>{darkMode ? darkMode : 'No Dark Mode'}</div>;
}
