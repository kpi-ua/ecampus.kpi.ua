'use client';

import { useTranslations } from 'next-intl';
import { useSelectedLayoutSegments } from 'next/navigation';
import { type ReactNode } from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

import { DeanOfficeTabs } from './dean-office-tabs';

const modulePath = '/module/zdekan';

export function DeanOfficePageLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('private.dean-office');
  const [section, subsection] = useSelectedLayoutSegments();

  if (section === 'students' && subsection) {
    return children;
  }

  const breadcrumbs = [[modulePath, t('title')]];
  let title = t('employees');

  if (section === 'students' || section === 'responsibilities') {
    title = t(section);
  }
  if (section === 'employees' && (subsection === 'lecturer-surveys' || subsection === 'contacts')) {
    breadcrumbs.push([`${modulePath}/employees`, t('employees')]);
    title = t(subsection === 'lecturer-surveys' ? 'lecturerSurveys' : 'contacts');
  }

  return (
    <SubLayout pageTitle={title} breadcrumbs={breadcrumbs}>
      <div className="col-span-full min-w-0">
        <DeanOfficeTabs>{children}</DeanOfficeTabs>
      </div>
    </SubLayout>
  );
}
