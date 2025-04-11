import { getMonitoring } from '@/actions/monitoring.actions';
import { getTranslations } from 'next-intl/server';
import { Studysheet } from '@/app/[locale]/(private)/module/studysheet/components/Studysheet';

const INTL_NAMESPACE = 'private.study-sheet';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function StudysheetPage() {
  const data = await getMonitoring();

  console.log(data);

  return <Studysheet sheet={data} />;
}
