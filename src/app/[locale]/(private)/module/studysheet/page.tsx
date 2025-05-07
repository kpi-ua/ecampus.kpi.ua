import { getTranslations } from 'next-intl/server';
import { StudySheet } from '@/app/[locale]/(private)/module/studysheet/components/study-sheet';
import { LocaleProps } from '@/types/locale-props';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'private.study-sheet' });

  return {
    title: t('title'),
  };
}

export default async function StudySheetPage() {
  return <StudySheet />;
}
