import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../../../components/app-sidebar/app-sidebar';
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
        <div className="grow bg-uncategorized-main p-[20px] lg:p-[28px]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
