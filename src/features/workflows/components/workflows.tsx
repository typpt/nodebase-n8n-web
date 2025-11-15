'use client';

import {
  EntityContainer,
  EntityEmpty,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityLoading,
  EntityPagination,
  EntitySearch,
} from '@/components/entity-components';
import type { Workflow } from '@/generated/prisma/client';
import { useEntitySearch } from '@/hooks/use-entity-search';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { formatDistanceToNow } from 'date-fns';
import { WorkflowIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from '../hooks/use-workflows';
import { useWorkflowsParams } from '../hooks/use-workflows-params';

export function WorkflowsList() {
  const workflows = useSuspenseWorkflows();

  return (
    <EntityList
      items={workflows.data.items}
      renderItem={(workflow) => <WorkflowsItem data={workflow} />}
      entityEmpty={<WorkflowsEmpty />}
      getKey={(workflow) => workflow.id}
    />
  );
}

export function WorkflowsItem({ data }: { data: Workflow }) {
  const removeWorkflows = useRemoveWorkflow();

  function handleRemove() {
    removeWorkflows.mutate({ id: data.id });
  }

  return (
    <EntityItem
      href={`/workflows/${data.id}`}
      title={`${data.name}`}
      subtitle={
        <>
          update {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{' '}
          &bull; Created{' '}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      isRemoving={removeWorkflows.isPending}
      onRemove={handleRemove}
    />
  );
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

export function WorkflowsSearch() {
  const [params, setParams] = useWorkflowsParams();
  const { onSearchChange, searchValue } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      onChange={onSearchChange}
      value={searchValue}
      placeholder="Search workflows"
    />
  );
}

export function WorkflowsPagination() {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      onPageChange={(page) => setParams({ ...params, page })}
      page={workflows.data.page}
      totalPages={workflows.data.totalPages}
      disabled={workflows.isFetching}
    />
  );
}

export function WorkflowsLoading() {
  return <EntityLoading message="Loading workflows..." />;
}

export function WorkflowsError() {
  return <EntityLoading message="Error loading workflows" />;
}

export function WorkflowsEmpty() {
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
      <EntityEmpty
        disabled={createWorkflow.isPending}
        onNew={handleCreate}
        message="You haven't created any workflows yet. Get started by creating your first workflow."
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
      pagination={<WorkflowsPagination />}
      search={<WorkflowsSearch />}
    >
      {children}
    </EntityContainer>
  );
}
