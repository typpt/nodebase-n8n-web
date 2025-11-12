'use client';

import { Button } from '@/components/ui/button';
import { useTRPC } from '@/integrations/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import LogoutButton from './logout';

export default function Home() {
  const trpc = useTRPC();
  const { data: workflows } = useQuery(trpc.getWorkflows.queryOptions());
  const createWorkflow = useMutation(trpc.createWorkflow.mutationOptions());
  const testAI = useMutation(trpc.testAI.mutationOptions());

  return (
    <div className="flex min-h-screen p-5 flex-col items-center justify-center gap-y-2 bg-zinc-50 font-sans dark:bg-black">
      <h1>Home Page</h1>
      <div>{JSON.stringify(workflows, null, 2)}</div>
      <Button
        type="button"
        onClick={() =>
          createWorkflow.mutate(undefined, {
            onSuccess: () => toast.success('Job Queued'),
            onError: (err) => toast.error(err.message),
          })
        }
        disabled={createWorkflow.isPending}
        variant="default"
        size="lg"
      >
        Create Workflow
      </Button>
      <Button
        type="button"
        onClick={() =>
          testAI.mutate(undefined, {
            onSuccess: () => toast.success('Test AI successfully'),
            onError: (err) => toast.error(err.message),
          })
        }
        disabled={testAI.isPending}
        variant="default"
        size="lg"
      >
        Test AI
      </Button>
      <LogoutButton />
    </div>
  );
}
