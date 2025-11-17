'use client';

import { NodeSelector } from '@/components/node-selector';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { memo, useState } from 'react';

export const EditorAddNodeButton = memo(() => {
  const [open, setOpen] = useState(false);

  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" size="icon">
        <PlusIcon className="size-4" />
      </Button>
    </NodeSelector>
  );
});

EditorAddNodeButton.displayName = 'EditorAddNodeButton';
