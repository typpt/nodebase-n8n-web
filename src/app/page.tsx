import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-2 bg-zinc-50 font-sans dark:bg-black">
      <h1>Home Page</h1>
      <Button type="button" variant="default" size="lg">
        Click Me
      </Button>
    </div>
  );
}
