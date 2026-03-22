import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { Header } from './header';
import { getUserDetails } from '@/actions/auth.actions';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/app-sidebar/footer';
import React from 'react';

import { PrivacyConsentDialog } from '@/components/privacy-consent-dialog';

export default async function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserDetails();

  if (!user) {
    notFound();
  }

  const showPrivacyConsent = !!user.employeeProfile && !user.privacyConsentAcceptDate;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header user={user} />
        <div className="bg-uncategorized-main grow p-[20px] lg:p-[28px]">{children}</div>
        <Footer />
      </SidebarInset>

      {showPrivacyConsent && <PrivacyConsentDialog />}
    </SidebarProvider>
  );
}
