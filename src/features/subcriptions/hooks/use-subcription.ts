import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';

export function useSubcription() {
  return useQuery({
    queryKey: ['subcription'],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });
}

export function useHasActiveSubcription() {
  const { data: customerState, isLoading, ...rest } = useSubcription();
  const hasActiveSubcription =
    customerState?.activeSubscriptions &&
    customerState?.activeSubscriptions.length > 0;

  return {
    hasActiveSubcription,
    subcription: customerState?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  };
}
