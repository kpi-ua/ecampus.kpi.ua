import { getTranslations } from 'next-intl/server';

import { getUserDetails } from '@/actions/auth.actions';
import {
  getCurator,
  getCuratorAdminGroups,
  getCuratorDepartments,
  getCuratorFilters,
  getCuratorGroups,
  getCuratorLecturers,
  getCuratorTeachingGroups,
} from '@/actions/curator.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

import { LecturerCuratorView } from './components/lecturer-curator-view';
import { StudentCuratorView } from './components/student-curator-view';

const INTL_NAMESPACE = 'private.curator';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function CuratorPage() {
  const [t, user] = await Promise.all([getTranslations(INTL_NAMESPACE), getUserDetails()]);
  const isLecturerProfile = !!user?.employeeProfile && !user.studentProfile;

  if (isLecturerProfile) {
    const [teachingGroups, groups, filters, departments] = await Promise.all([
      getCuratorTeachingGroups(),
      getCuratorGroups(),
      getCuratorFilters(),
      getCuratorDepartments(),
    ]);
    const [adminGroups, lecturers] = departments.length
      ? await Promise.all([getCuratorAdminGroups(), getCuratorLecturers()])
      : [[], []];

    return (
      <SubLayout pageTitle={t('title')}>
        <div className="col-span-12 w-full px-2 sm:px-4 md:px-0">
          <LecturerCuratorView
            teachingGroups={teachingGroups}
            groups={groups}
            filters={filters}
            departments={departments}
            adminGroups={adminGroups}
            lecturers={lecturers}
          />
        </div>
      </SubLayout>
    );
  }

  const curator = await getCurator();

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-8 w-full px-2 sm:px-4 md:px-0">
        <Heading2>{t('title')}</Heading2>
        <StudentCuratorView curator={curator} />
      </div>
    </SubLayout>
  );
}
