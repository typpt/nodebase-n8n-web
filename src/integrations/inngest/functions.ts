import { getExecutor } from '@/features/executions/lib/executor-registry';
import { NodeType } from '@/generated/prisma/enums';
import db from '@/lib/db';
import { NonRetriableError } from 'inngest';
import { googleFormTriggerChannel } from './channel/google-form-trigger';
import { httpRequestChannel } from './channel/http-request';
import { manualTriggerChannel } from './channel/manual-trigger';
import { inngest } from './client';
import { topologicalSort } from './utils';

export const executeWorkflow = inngest.createFunction(
  { id: 'execute-workflow', retries: 0 },
  {
    event: 'workflows/execute.workflow',
    channel: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
    ],
  },

  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) throw new NonRetriableError('Workflow ID is missing');

    const sortedNodes = await step.run('prepare-workflow', async () => {
      const workflow = await db.workflow.findUnique({
        where: { id: workflowId },
        include: { connections: true, nodes: true },
      });

      if (!workflow) throw new NonRetriableError('Workflow not found');

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    let context = {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);

      context = await executor({
        context,
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        step,
        publish,
      });
    }

    return {
      sortedNodes,
      result: context,
    };
  }
);
