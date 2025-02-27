import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionToken } from '../../../database/sessions';
import RegisterForm from './ RegisterForm';

type Props = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};
export default async function RegisterPage(props: Props) {
  // Task: Add redirect to home if user is logged in

  // 1. Check if the sessionToken cookie exists
  const cookieStore = await cookies();

  // 1. Get the session token from the cookie
  const sessionTokenCookie = cookieStore.get('sessionToken');

  // 2. Check if the sessionToken cookie is still valid
  const session =
    sessionTokenCookie &&
    (await getValidSessionToken(sessionTokenCookie.value));

  // 3. If the sessionToken cookie is valid, redirect to home
  if (session) {
    redirect('/');
  }

  const { returnTo } = await props.searchParams;

  return <RegisterForm returnTo={returnTo} />;
}
