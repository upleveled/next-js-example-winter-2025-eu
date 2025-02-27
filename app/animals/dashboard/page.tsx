import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAnimals } from '../../../database/animals';
import { getValidSessionToken } from '../../../database/sessions';
import AnimalsForm from './AnimalsForm';

export const metadata = {
  title: 'Animal Admin page',
  description: 'Generated by create next app',
};

export default async function AnimalsPage() {
  // Task: Protect the dashboard page and redirect to login if the user is not logged in
  // 4. If the sessionToken cookie is valid, allow access to dashboard page
  // const animals = await getAnimalsInsecure();

  // 1. Checking if the sessionToken cookie exists
  const cookieStore = await cookies();

  // 1. Get the session token from the cookie
  const sessionTokenCookie = cookieStore.get('sessionToken');

  // 2. Check if the sessionToken cookie is still valid
  const session =
    sessionTokenCookie &&
    (await getValidSessionToken(sessionTokenCookie.value));

  // 3. If the sessionToken cookie is invalid or doesn't exist, redirect to login with returnTo
  if (!session) {
    redirect('/login?returnTo=/animals/dashboard');
  }

  const animals = await getAnimals(session.token);
  return <AnimalsForm animals={animals} />;
}
