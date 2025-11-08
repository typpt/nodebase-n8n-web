'use client';

import { useTRPC } from '@/integrations/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function Client() {
  const trpc = useTRPC();
  const { data: users } = useSuspenseQuery(trpc.getMany.queryOptions());

  return <div>{JSON.stringify(users, null, 2)}</div>;
}
