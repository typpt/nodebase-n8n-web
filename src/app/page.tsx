import { caller } from '@/integrations/trpc/server';
import { requireAuth } from '@/lib/auth-utils';
import LogoutButton from './logout';

export default async function Home() {
  await requireAuth();

  const users = await caller.users();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-2 bg-zinc-50 font-sans dark:bg-black">
      <h1>Home Page</h1>
      {users && <LogoutButton />}
      <div>{JSON.stringify(users, null, 2)}</div>
    </div>
  );
}
