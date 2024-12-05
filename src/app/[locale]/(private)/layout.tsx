import { SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from "next";
import { AppSidebar } from './app-sidebar';
import { Header } from './header';

export const metadata: Metadata = {
  title: "Кампус КПІ",
  description: "Кампус КПІ",
};

export default function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col w-full bg-uncategorized-main">
        <Header />
        <div className="grow p-[24px]">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
