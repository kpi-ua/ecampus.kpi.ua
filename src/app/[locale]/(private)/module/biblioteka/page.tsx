import { getTranslations } from 'next-intl/server';

import { getLibraryDepartments } from '@/actions/library.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading3 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

import { LibraryTabs } from './components/library-tabs';
import { DepartmentFilters } from './components/department-filters';

const INTL_NAMESPACE = 'private.library';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function LibraryPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const departments = await getLibraryDepartments();
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <LibraryTabs active="departments" />
        <div className="flex flex-col gap-2">
          <Heading3 className="leading-xl lg:leading-xl text-2xl lg:text-2xl">{t('departments.title')}</Heading3>
          <Description className="p-0 text-sm leading-6">{t('departments.description')}</Description>
        </div>
        <DepartmentFilters departments={departments} />
      </div>
    </SubLayout>
  );
}
