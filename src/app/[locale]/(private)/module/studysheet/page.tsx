import { getTranslations } from 'next-intl/server';
import { StudySheet } from '@/app/[locale]/(private)/module/studysheet/components/study-sheet';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'private.study-sheet' });

  return {
    title: t('title'),
  };
}

export default async function StudySheetPage() {
  return <StudySheet />;
}
