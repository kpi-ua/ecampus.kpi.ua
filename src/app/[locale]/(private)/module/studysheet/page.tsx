import { getTranslations } from 'next-intl/server';
import { Studysheet } from '@/app/[locale]/(private)/module/studysheet/components/Studysheet';
import { INTL_NAMESPACE } from '@/app/[locale]/(private)/module/studysheet/constants';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function StudysheetPage() {
  return <Studysheet />;
}
