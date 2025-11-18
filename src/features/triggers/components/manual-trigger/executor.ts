import { NodeExecutor } from '@/features/types';

export const manualTriggerExecutor: NodeExecutor<
  Record<string, unknown>
> = async ({ context, step }) => {
  const result = await step.run('manual-trigger', () => context);

  return result;
};
