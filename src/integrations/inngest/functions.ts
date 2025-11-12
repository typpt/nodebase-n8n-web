import db from '@/lib/db';
import { inngest } from './client';

export const exucutes = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },

  async ({ event, step }) => {
    await step.run('create-workflow', async () => {
      return await db.workflow.create({
        data: {
          name: 'workflow-from-inngest',
        },
      });
    });
  }
);
