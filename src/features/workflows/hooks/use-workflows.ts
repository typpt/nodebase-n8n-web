import { useTRPC } from '@/integrations/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSuspenseWorkflows() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" created.`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions());
      },
      onError: (err) => {
        toast.success(`Failed to create workflow: ${err.message}`);
      },
    })
  );
}
