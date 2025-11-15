'use client';

import { EntityLoading } from '@/components/entity-components';
import { useSuspenseWorkflow } from '@/features/workflows/hooks/use-workflows';

export function Editor({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  return <div>{JSON.stringify(workflow, null, 2)}</div>;
}

export function EditorLoading() {
  return <EntityLoading message="Loading editor..." />;
}

export function EditorError() {
  return <EntityLoading message="Error loading editor" />;
}
