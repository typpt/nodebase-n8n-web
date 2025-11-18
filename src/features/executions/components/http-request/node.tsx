'use client';

import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { GlobeIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { HttpRequestDialog, HttpRequestFormValues } from './dialog';

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = 'initial';
  const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData.endpoint
    ? `${nodeData.method || 'GET'}: ${nodeData.endpoint}`
    : 'Not configured';

  function handleSubmit(values: HttpRequestFormValues) {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: { ...node.data, ...values },
          };
        }
        return node;
      })
    );
  }

  return (
    <>
      <HttpRequestDialog
        open={open}
        onSubmit={handleSubmit}
        onOpenChange={setOpen}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onDoubleClick={() => setOpen(true)}
        onSettings={() => setOpen(true)}
      />
    </>
  );
});

HttpRequestNode.displayName = 'HttpRequestNode';
