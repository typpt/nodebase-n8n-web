'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { memo } from 'react';

export const EditorAddNodeButton = memo(() => {
  return (
    <Button type="button" onClick={() => {}} variant="outline" size="icon">
      <PlusIcon className="size-4" />
    </Button>
  );
});

EditorAddNodeButton.displayName = 'EditorAddNodeButton';
