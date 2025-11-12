import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import 'server-only';
import { auth } from './auth';

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/sign-in');
}

export async function requireUnauth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect('/');
}
