'use client';

import { EntityContainer, EntityHeader } from '@/components/entity-components';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useRouter } from 'next/navigation';
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from '../hooks/use-workflows';

export function WorkflowsList() {
  const workflows = useSuspenseWorkflows();

  return <div className="">{JSON.stringify(workflows.data, null, 2)}</div>;
}

export function WorkflowsHeader({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  function handleCreate() {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => router.push(`/workflows/${data.id}`),
      onError: (err) => handleError(err),
    });
  }

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
        newButtonLabel="New Workflow"
        onNew={handleCreate}
      />
    </>
  );
}

export function WorkflowsContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      pagination={<p>Pagination</p>}
      search={<p>Search</p>}
    >
      {children}
    </EntityContainer>
  );
}
