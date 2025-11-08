import { Button } from '@/components/ui/button';
import db from '@/lib/db';

export default async function Home() {
  const users = await db.user.findMany();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-2 bg-zinc-50 font-sans dark:bg-black">
      <h1>Home Page</h1>
      <Button type="button" variant="default" size="lg">
        Click Me
      </Button>
      <div>{JSON.stringify(users, null, 2)}</div>
    </div>
  );
}
