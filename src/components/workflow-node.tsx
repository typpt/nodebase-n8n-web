'use client';

import { NodeToolbar, Position } from '@xyflow/react';
import { SettingsIcon, TrashIcon } from 'lucide-react';
import { Activity } from 'react';
import { Button } from './ui/button';

type Props = {
  children: Readonly<React.ReactNode>;
  name?: string;
  description?: string;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
};

export function WorkflowNode({
  children,
  description,
  name,
  onDelete,
  onSettings,
  showToolbar = true,
}: Props) {
  return (
    <>
      <Activity mode={!!showToolbar ? 'visible' : 'hidden'}>
        <NodeToolbar>
          <Button type="button" onClick={onSettings} variant="ghost" size="sm">
            <SettingsIcon className="size-4" />
          </Button>
          <Button type="button" onClick={onDelete} variant="ghost" size="sm">
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      </Activity>
      {children}
      <Activity mode={!!name ? 'visible' : 'hidden'}>
        <NodeToolbar
          isVisible
          position={Position.Bottom}
          className="max-w-[200px] text-center"
        >
          <h3 className="font-medium">{name}</h3>
          {description && (
            <p className="text-muted-foreground truncate text-sm">
              {description}
            </p>
          )}
        </NodeToolbar>
      </Activity>
    </>
  );
}
