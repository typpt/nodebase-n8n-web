'use client';

import { useHasActiveSubcription } from '@/features/subcriptions/hooks/use-subcription';
import { authClient } from '@/lib/auth-client';
import {
  CreditCard,
  FolderIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, useTransition } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';

const menuItems = [
  {
    title: 'Main',
    items: [
      {
        title: 'Workflows',
        url: '/workflows',
        icon: FolderIcon,
      },
      {
        title: 'Credentials',
        url: '/credentials',
        icon: KeyIcon,
      },
      {
        title: 'Executions',
        url: '/executions',
        icon: HistoryIcon,
      },
    ],
  },
];

export default function AppSidebar() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubcription, isLoading } = useHasActiveSubcription();

  function handleLogout() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: { onSuccess: () => router.push('/sign-in') },
      });
    });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 gap-x-4 px-4">
              <Link
                href="/"
                className="flex items-center gap-2 self-center font-medium"
              >
                <Image src="/logo.svg" alt="Nodebase" height={20} width={20} />
                <span>Nodebase</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        item.url === '/'
                          ? pathname === '/'
                          : pathname.startsWith(item.url)
                      }
                      asChild
                      className="h-10 gap-x-4 px-4"
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <Activity
            mode={!hasActiveSubcription && !isLoading ? 'visible' : 'hidden'}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={async () => await authClient.checkout({ slug: 'pro' })}
                tooltip="Upgrade to Pro"
                className="h-10 gap-x-4 px-4"
              >
                <StarIcon className="size-4" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Activity>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => await authClient.customer.portal()}
              tooltip="Billing Portal"
              className="h-10 gap-x-4 px-4"
            >
              <CreditCard className="size-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isPending}
              tooltip="Logout"
              className="h-10 gap-x-4 px-4"
            >
              <LogOutIcon className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
