import db from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    return await db.user.findMany();
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
