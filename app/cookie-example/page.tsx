import { cookies } from 'next/headers';
import SetCookieForm from './SetCookieForm';

export default async function SetCookiePage() {
  const testCookie = (await cookies()).get('testCookie');
  // cookies().get returns an object!
  // { name: 'testCookie', value: 'this is a value' }

  return (
    <>
      {/* Optional Chaining
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
      */}
      <div>Cookie Value: {testCookie?.value}</div>
      <SetCookieForm />
    </>
  );
}
