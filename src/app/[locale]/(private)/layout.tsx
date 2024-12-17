import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { AppSidebar } from './app-sidebar';
import { Header } from './header';

export default function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="grow bg-uncategorized-main p-12">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
