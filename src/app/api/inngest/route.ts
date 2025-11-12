import { inngest } from '@/integrations/inngest/client';
import { execute } from '@/integrations/inngest/functions';
import { serve } from 'inngest/next';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    execute,
  ],
});
