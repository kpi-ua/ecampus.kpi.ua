import { notFound } from 'next/navigation';
import React from 'react';

import { getUserDetails } from '@/actions/auth.actions';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { Footer } from '@/components/app-sidebar/footer';
import { PermissionProvider } from '@/components/permission-provider';
import { PrivacyConsentDialog } from '@/components/privacy-consent-dialog';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUserModules } from '@/lib/jwt';

import { Header } from './header';

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
          <div className="grow bg-uncategorized-main p-[20px] lg:p-[28px]">{children}</div>
          <Footer />
        </SidebarInset>

        {showPrivacyConsent && <PrivacyConsentDialog />}
      </SidebarProvider>
    </PermissionProvider>
  );
}
