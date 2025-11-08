import { Button } from '@/components/ui/button';
import { getQueryClient, trpc } from '@/integrations/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Client from './client';

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getMany.queryOptions());

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-2 bg-zinc-50 font-sans dark:bg-black">
      <h1>Home Page</h1>
      <Button type="button" variant="default" size="lg">
        Click Me
      </Button>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <Client />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
}
