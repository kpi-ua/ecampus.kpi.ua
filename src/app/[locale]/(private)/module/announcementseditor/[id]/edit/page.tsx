import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getAdminAnnouncementById, getCourses, getRoles, getStudyForms } from '@/actions/announcement.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';

import { buildAnnouncementFormValues } from '../../utils/build-announcement-form-values';
import { EditAnnouncementPage } from './edit-announcement-page';

const INTL_NAMESPACE = 'private.announcementseditor';

interface PageProps {
  params: Promise<{ locale: string; id: number }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('edit.title'),
  };
}

export default async function EditAnnouncement({ params }: PageProps) {
  const t = await getTranslations(INTL_NAMESPACE);
  const { id } = await params;

  const [item, rolesData, studyFormsData, coursesData] = await Promise.all([
    getAdminAnnouncementById(id),
    getRoles(),
    getStudyForms(),
    getCourses(),
  ]);

  if (!item) {
    notFound();
  }

  const initialValues = buildAnnouncementFormValues(item);

  return (
    <SubLayout pageTitle={t('edit.title')}>
      <div className="col-span-12">
        <Heading2>{t('edit.title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        <EditAnnouncementPage
          id={id}
          initialValues={initialValues}
          rolesData={rolesData}
          studyFormsData={studyFormsData}
          coursesData={coursesData}
        />
      </div>
    </SubLayout>
  );
}
