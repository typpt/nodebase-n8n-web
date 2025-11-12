import { inngest } from '@/integrations/inngest/client';
import db from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '../init';

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(async () => {
    return await db.workflow.findMany();
  }),

  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: 'test/hello.world',
    });

    return {
      success: true,
      message: 'Job Queued',
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
