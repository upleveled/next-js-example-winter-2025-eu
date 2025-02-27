import { cookies } from 'next/headers';

export async function getCookie(name: string) {
  const cookie = (await cookies()).get(name);
  if (!cookie) {
    return undefined;
  }
  return cookie.value;
}

export const secureCookieOptions = {
  httpOnly: true,
  path: '/',
  maxAge: 60 * 60 * 24, // Expires 24 hours
  sameSite: 'lax', // Prevent sending cookie with images or frames of your content originating on other websites
  secure: process.env.NODE_ENV === 'production',
} as const;
