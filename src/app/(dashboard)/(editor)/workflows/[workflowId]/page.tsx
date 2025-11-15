import {
  Editor,
  EditorError,
  EditorLoading,
} from '@/features/editor/components/editor';
import EditorHeader from '@/features/editor/components/editor-header';
import { prefetchWorkflow } from '@/features/workflows/server/prefetch';
import { HydrateClient } from '@/integrations/trpc/server';
import { requireAuth } from '@/lib/auth-utils';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  params: Promise<{ workflowId: string }>;
};

export default async function Page({ params }: Props) {
  await requireAuth();

  const { workflowId } = await params;
  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <main className="flex-1">
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
