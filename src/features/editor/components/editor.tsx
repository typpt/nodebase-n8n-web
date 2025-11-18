'use client';

import { EntityLoading } from '@/components/entity-components';
import { nodeComponents } from '@/constant/node-components';
import { useSuspenseWorkflow } from '@/features/workflows/hooks/use-workflows';
import { NodeType } from '@/generated/prisma/enums';
import {
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type Node,
  type NodeChange,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSetAtom } from 'jotai';
import { Activity, useCallback, useMemo, useState } from 'react';
import { editorAtom } from '../store/atoms';
import { EditorAddNodeButton } from './editor-add-node-button';
import { ExecuteWorkflowButton } from './execute-workflow-button';

export function Editor({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const setEditor = useSetAtom(editorAtom);
  const hasManualTrigger = useMemo(
    () => nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER),
    [nodes]
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <EditorAddNodeButton />
        </Panel>
        <Activity mode={hasManualTrigger ? 'visible' : 'hidden'}>
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        </Activity>
      </ReactFlow>
    </div>
  );
}

export function EditorLoading() {
  return <EntityLoading message="Loading editor..." />;
}

export function EditorError() {
  return <EntityLoading message="Error loading editor" />;
}
