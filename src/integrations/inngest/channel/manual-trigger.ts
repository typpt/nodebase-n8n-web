import { channel, topic } from '@inngest/realtime';

export const MANUAL_TRIGGER_CHANNEL_NAME = 'manual-trigger-execution' as const;

export const manualTriggerChannel = channel(
  MANUAL_TRIGGER_CHANNEL_NAME
).addTopic(
  topic('status').type<{
    nodeId: string;
    status: 'loading' | 'success' | 'error';
  }>()
);
