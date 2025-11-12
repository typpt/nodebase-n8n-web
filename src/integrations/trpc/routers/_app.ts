import db from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '../init';

export const appRouter = createTRPCRouter({
  users: protectedProcedure.query(async () => {
    return await db.user.findMany();
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
