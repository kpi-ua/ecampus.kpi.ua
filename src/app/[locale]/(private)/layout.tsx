import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { Header } from './header';
import { getUserDetails } from '@/actions/auth.actions';

export default async function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserDetails();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header user={user} />
        <div className="grow bg-uncategorized-main p-[20px] lg:p-[28px]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
