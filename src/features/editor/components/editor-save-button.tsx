'use client';

import { Button } from '@/components/ui/button';
import { useUpdateWorkflow } from '@/features/workflows/hooks/use-workflows';
import { useAtomValue } from 'jotai';
import { SaveIcon } from 'lucide-react';
import { editorAtom } from '../store/atoms';

export function EditorSaveButton({ workflowId }: { workflowId: string }) {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  function handleSave() {
    if (!editor) return;

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    saveWorkflow.mutate({ id: workflowId, nodes, edges });
  }

  return (
    <div className="ml-auto">
      <Button
        type="button"
        onClick={handleSave}
        disabled={saveWorkflow.isPending}
        variant="default"
        size="sm"
      >
        <SaveIcon className="size-4" />
        <span>Save</span>
      </Button>
    </div>
  );
}
