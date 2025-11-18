'use server';

import { manualTriggerChannel } from '@/integrations/inngest/channel/manual-trigger';
import { inngest } from '@/integrations/inngest/client';
import { getSubscriptionToken, Realtime } from '@inngest/realtime';

export type ManulTriggerToken = Realtime.Token<
  typeof manualTriggerChannel,
  ['status']
>;

export async function manualTriggerToken(): Promise<ManulTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: manualTriggerChannel(),
    topics: ['status'],
  });

  return token;
}
