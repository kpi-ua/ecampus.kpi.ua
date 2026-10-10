import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { Header } from './header';
import { getUserDetails } from '@/actions/auth.actions';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/app-sidebar/footer';
import React from 'react';

import { PrivacyConsentDialog } from '@/components/privacy-consent-dialog';
import { PermissionProvider } from '@/components/permission-provider';
import { getUserModules } from '@/lib/jwt';

export default async function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserDetails();

  if (!user) {
    notFound();
  }

  const showPrivacyConsent = !!user.employeeProfile && !user.privacyConsentDate;
  const modules = await getUserModules();

  return (
    <PermissionProvider modules={modules}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header user={user} />
          <div className="bg-uncategorized-main grow p-[20px] lg:p-[28px]">{children}</div>
          <Footer />
        </SidebarInset>

        {showPrivacyConsent && <PrivacyConsentDialog />}
      </SidebarProvider>
    </PermissionProvider>
  );
}
