'use client';

import { Button } from '@/components/ui/button';
import { useExecuteWorkflow } from '@/features/workflows/hooks/use-workflows';
import { FlaskConicalIcon } from 'lucide-react';

export function ExecuteWorkflowButton({ workflowId }: { workflowId: string }) {
  const executeWorkflow = useExecuteWorkflow();

  function handleExecute() {
    executeWorkflow.mutate({ id: workflowId });
  }

  return (
    <Button
      type="button"
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
      variant="default"
      size="lg"
    >
      <FlaskConicalIcon className="size-4" />
      <span>Execute Workflow</span>
    </Button>
  );
}
