'use client';

import type { NodeProps } from '@xyflow/react';
import { MousePointer2Icon } from 'lucide-react';
import { memo } from 'react';
import { BaseTriggerNode } from '../base-trigger-node';

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      icon={MousePointer2Icon}
      name="Manual Trigger"
      description="When clicking 'Execute workflow'"
    />
  );
});

ManualTriggerNode.displayName = 'ManualTriggerNode';
