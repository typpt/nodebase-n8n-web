'use client';

import { BaseHandle } from '@/components/react-flow/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/react-flow/base-node';
import {
  NodeStatus,
  NodeStatusIndicator,
} from '@/components/react-flow/node-status-indicator';
import { WorkflowNode } from '@/components/workflow-node';
import { NodeProps, Position, useReactFlow } from '@xyflow/react';
import { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';

type Props = {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  status?: NodeStatus;
  children?: Readonly<React.ReactNode>;
  onSettings?: () => void;
  onDoubleClick?: () => void;
} & NodeProps;

export const BaseTriggerNode = memo(
  ({
    id,
    name,
    icon: Icon,
    description,
    children,
    status = 'initial',
    onDoubleClick,
    onSettings,
  }: Props) => {
    const { setEdges, setNodes } = useReactFlow();

    function handleDelete() {
      setNodes((currentNodes) => {
        const updateNode = currentNodes.filter((node) => node.id !== id);
        return updateNode;
      });

      setEdges((currentEdges) => {
        const updateEdge = currentEdges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );
        return updateEdge;
      });
    }

    return (
      <WorkflowNode
        name={name}
        onDelete={handleDelete}
        description={description}
        onSettings={onSettings}
      >
        <NodeStatusIndicator
          status={status}
          variant="border"
          className="rounded-l-2xl"
        >
          <BaseNode
            onDoubleClick={onDoubleClick}
            className="rounded-l-2xl relative group"
            status={status}
          >
            <BaseNodeContent>
              {typeof Icon === 'string' ? (
                <Image src={Icon} alt={name} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  }
);

BaseTriggerNode.displayName = 'BaseTriggerNode';
