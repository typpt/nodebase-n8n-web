import { NodeExecutor } from '@/features/types';
import { googleFormTriggerChannel } from '@/integrations/inngest/channel/google-form-trigger';

export const googleFormTriggerExecutor: NodeExecutor<
  Record<string, unknown>
> = async ({ nodeId, context, step, publish }) => {
  await publish(
    googleFormTriggerChannel().status({ nodeId, status: 'loading' })
  );

  const result = await step.run('google-form-trigger', () => context);

  await publish(
    googleFormTriggerChannel().status({ nodeId, status: 'success' })
  );

  return result;
};
