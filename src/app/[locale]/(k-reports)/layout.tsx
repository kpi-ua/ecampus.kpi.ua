import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';

import { getUserDetails, logout } from '@/actions/auth.actions';
import { CoatOfArms, SignOut } from '@/app/images';
import { PrivacyConsentDialog } from '@/components/privacy-consent-dialog';
import { Button } from '@/components/ui/button';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Link } from '@/i18n/routing';
import { getUniqueUserPhotoUrl } from '@/lib/utils';

export default async function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserDetails();

  if (!user) {
    notFound();
  }

  if (!user.employeeProfile) {
    notFound();
  }

  const showPrivacyConsent = !user.privacyConsentDate;
  const primaryPosition = user.employeeProfile.positions[0]?.name;
  const t = await getTranslations('private.k-reports.k-7.footer');

  return (
    <div className="bg-basic-white flex min-h-screen flex-col overflow-x-hidden">
      <header className="flex w-full min-w-0 items-start justify-between gap-6 px-4 pt-3 pb-10 md:px-[80px]">
        <Link href="/" className="text-brand-900 flex items-center gap-2">
          <CoatOfArms className="size-[32px] [&_path]:!fill-current" />
          <div className="flex flex-col leading-none">
            <span className="text-[12px] leading-[14px] font-medium">K-7</span>
            <span className="text-[24px] leading-[24px] font-extrabold">КПІ</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 text-neutral-900 sm:flex">
            <ProfilePicture size="xs" src={getUniqueUserPhotoUrl(user.photo)} />
            <div className="flex flex-col">
              <span className="leading-sm text-sm font-semibold">{user.fullName || user.username}</span>
              {primaryPosition && <span className="leading-xs text-xs font-semibold">{primaryPosition}</span>}
            </div>
          </div>
          <form action={logout}>
            <Button icon={<SignOut />} size="small" type="submit" variant="secondary" className="size-[32px] p-0" />
          </form>
        </div>
      </header>

      <div className="min-w-0 grow px-4 md:px-[80px]">{children}</div>

      <footer className="leading-xs mt-auto flex w-full min-w-0 flex-col items-center justify-center gap-3 px-4 py-8 text-center text-xs text-neutral-700 sm:flex-row sm:flex-wrap md:px-[80px]">
        <span className="leading-sm max-w-[280px] sm:max-w-full">{t('rights', { year: dayjs().year() })}</span>
        <Link href="/terms-of-service" className="leading-xs text-xs font-semibold">
          {t('terms')}
        </Link>
      </footer>
      {showPrivacyConsent && <PrivacyConsentDialog />}
    </div>
  );
}
