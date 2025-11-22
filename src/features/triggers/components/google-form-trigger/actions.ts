'use server';

import { googleFormTriggerChannel } from '@/integrations/inngest/channel/google-form-trigger';
import { inngest } from '@/integrations/inngest/client';
import { getSubscriptionToken, Realtime } from '@inngest/realtime';

export type GoogleFormTriggerToken = Realtime.Token<
  typeof googleFormTriggerChannel,
  ['status']
>;

export async function googleFormTriggerToken(): Promise<GoogleFormTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: googleFormTriggerChannel(),
    topics: ['status'],
  });

  return token;
}
