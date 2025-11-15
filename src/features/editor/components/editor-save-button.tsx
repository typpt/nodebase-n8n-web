'use client';

import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';

export function EditorSaveButton({ workflowId }: { workflowId: string }) {
  return (
    <div className="ml-auto">
      <Button type="button" onClick={() => {}} variant="default" size="sm">
        <SaveIcon className="size-4" />
        <span>Save</span>
      </Button>
    </div>
  );
}
