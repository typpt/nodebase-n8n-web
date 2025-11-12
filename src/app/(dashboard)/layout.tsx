import AppSidebar from '@/components/app-sedebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">{children}</SidebarInset>
    </SidebarProvider>
  );
}
