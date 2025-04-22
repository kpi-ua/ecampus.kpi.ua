import { getTranslations } from 'next-intl/server';
import { StudySheet } from '@/app/[locale]/(private)/module/studysheet/components/study-sheet';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'private.study-sheet' });

  return {
    title: t('title'),
  };
}

export default async function StudySheetPage() {
  return <StudySheet />;
}
