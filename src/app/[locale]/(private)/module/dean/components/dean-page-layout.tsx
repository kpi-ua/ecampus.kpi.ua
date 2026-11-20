'use client';

import { useTranslations } from 'next-intl';
import { useSelectedLayoutSegments } from 'next/navigation';
import { type ReactNode } from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

import { DeanTabs } from './dean-tabs';

const modulePath = '/module/dean';

export function DeanPageLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('private.dean');
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
        <DeanTabs>{children}</DeanTabs>
      </div>
    </SubLayout>
  );
}
