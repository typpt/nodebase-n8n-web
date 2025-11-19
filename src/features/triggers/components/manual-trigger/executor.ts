import { NodeExecutor } from '@/features/types';
import { manualTriggerChannel } from '@/integrations/inngest/channel/manual-trigger';

export const manualTriggerExecutor: NodeExecutor<
  Record<string, unknown>
> = async ({ nodeId, context, step, publish }) => {
  await publish(manualTriggerChannel().status({ nodeId, status: 'loading' }));

  const result = await step.run('manual-trigger', () => context);

  await publish(manualTriggerChannel().status({ nodeId, status: 'success' }));

  return result;
};
