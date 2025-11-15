'use client';

import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import {
  useSuspenseWorkflow,
  useUpdateWorkflow,
} from '@/features/workflows/hooks/use-workflows';
import { useEffect, useRef, useState } from 'react';

export function EditorNameInput({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflow = useUpdateWorkflow();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  async function handleSave() {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflow.mutateAsync({ id: workflowId, name });
    } catch {
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  }

  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setName(workflow.name);
    }
  }

  if (isEditing) {
    return (
      <Input
        type="text"
        value={name}
        disabled={updateWorkflow.isPending}
        ref={inputRef}
        onBlur={handleSave}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeydown}
        className="h-7 w-auto max-w-[150px] px-2"
      />
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:text-foreground transition-colors"
    >
      {workflow.name}
    </BreadcrumbItem>
  );
}
