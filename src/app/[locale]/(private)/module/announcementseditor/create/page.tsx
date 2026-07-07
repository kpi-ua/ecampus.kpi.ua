import { getTranslations } from 'next-intl/server';

import { getCourses, getRoles, getStudyForms } from '@/actions/announcement.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';
import { CreateAnnouncementPage } from './create-announcement-page';

const INTL_NAMESPACE = 'private.announcementseditor';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('create.title'),
  };
}

export default async function CreateAnnouncement() {
  const t = await getTranslations(INTL_NAMESPACE);
  const [rolesData, studyFormsData, coursesData] = await Promise.all([
    getRoles(),
    getStudyForms(),
    getCourses(),
  ]);

  return (
    <SubLayout pageTitle={t('create.title')}>
      <div className="col-span-12">
        <Heading2>{t('create.title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        <CreateAnnouncementPage rolesData={rolesData} studyFormsData={studyFormsData} coursesData={coursesData} />
      </div>
    </SubLayout>
  );
}
