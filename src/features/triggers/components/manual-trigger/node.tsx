'use client';

import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { MANUAL_TRIGGER_CHANNEL_NAME } from '@/integrations/inngest/channel/manual-trigger';
import type { NodeProps } from '@xyflow/react';
import { MousePointer2Icon } from 'lucide-react';
import { memo, useState } from 'react';
import { BaseTriggerNode } from '../base-trigger-node';
import { manualTriggerToken } from './actions';
import { ManualTriggerDialog } from './dialog';

export const ManualTriggerNode = memo((props: NodeProps) => {
  const nodeStatus = useNodeStatus({
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    nodeId: props.id,
    refreshToken: manualTriggerToken,
    topic: 'status',
  });
  const [open, setOpen] = useState(false);

  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
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
