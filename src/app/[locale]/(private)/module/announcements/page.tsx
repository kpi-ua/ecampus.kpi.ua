import { getTranslations } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import React from 'react';
import { AnnouncementManagement } from './components/announcement-management';
import { getStudyForms, getAllGroups, getSubdivisions, getCourses, getRoles } from '@/actions/announcement.actions';

const INTL_NAMESPACE = 'private.announcements';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function AnnouncementsPage({ params }: LocaleProps) {
  const t = await getTranslations(INTL_NAMESPACE);
  const rolesData = await getRoles();
  const studyFormsData = await getStudyForms();
  const groupsData = await getAllGroups();
  const subdivisionsData = await getSubdivisions();
  const coursesData = await getCourses();

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>

        <AnnouncementManagement
          rolesData={rolesData}
          studyFormsData={studyFormsData}
          groupsData={groupsData}
          subdivisionsData={subdivisionsData}
          coursesData={coursesData}
        />
      </div>
    </SubLayout>
  );
}
