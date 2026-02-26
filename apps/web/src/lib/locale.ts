'use server';

import { cookies } from 'next/headers';

export async function setLocale(locale: string) {
  cookies().set('locale', locale, {
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  });
}
