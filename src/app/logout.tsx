'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={async () =>
        await authClient.signOut({
          fetchOptions: { onSuccess: () => router.push('/sign-in') },
        })
      }
      variant="destructive"
      size="lg"
    >
      Logout
    </Button>
  );
}
