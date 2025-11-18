'use client';

import type { NodeProps } from '@xyflow/react';
import { MousePointer2Icon } from 'lucide-react';
import { memo, useState, ViewTransition } from 'react';
import { BaseTriggerNode } from '../base-trigger-node';
import { ManualTriggerDialog } from './dialog';

export const ManualTriggerNode = memo((props: NodeProps) => {
  const nodeStatus = 'initial';
  const [open, setOpen] = useState(false);

  return (
    <>
      <ViewTransition>
        <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      </ViewTransition>
      <BaseTriggerNode
        {...props}
        icon={MousePointer2Icon}
        name="Manual Trigger"
        status={nodeStatus}
        description="When clicking 'Execute workflow'"
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
      />
    </>
  );
});

ManualTriggerNode.displayName = 'ManualTriggerNode';
