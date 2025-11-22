'use client';

import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from '@/integrations/inngest/channel/google-form-trigger';
import type { NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseTriggerNode } from '../base-trigger-node';
import { googleFormTriggerToken } from './actions';
import { GoogleFormTriggerDialog } from './dialog';

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const nodeStatus = useNodeStatus({
    channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
    nodeId: props.id,
    refreshToken: googleFormTriggerToken,
    topic: 'status',
  });
  const [open, setOpen] = useState(false);

  return (
    <>
      <GoogleFormTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon="/google-form.svg"
        name="Google Form"
        status={nodeStatus}
        description="When form is submitted"
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
      />
    </>
  );
});

GoogleFormTriggerNode.displayName = 'GoogleFormTriggerNode';
