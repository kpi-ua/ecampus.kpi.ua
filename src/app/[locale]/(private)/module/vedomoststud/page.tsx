import { getTranslations } from 'next-intl/server';

import { getTerm, getTermSemesters } from '@/actions/term.actions';
import { LocaleProps } from '@/types/locale-props';

import SessionTable from './components/table';

const INTL_NAMESPACE = 'private.vedomoststud';

interface PageProps extends LocaleProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function SessionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const semesterId = typeof params?.semesterId === 'string' ? params.semesterId : undefined;

  const termResults = await getTerm(semesterId);
  const semesters = await getTermSemesters();

  const fixedTermResults = {
    ...termResults,
    disciplines: termResults.disciplines.map((discipline) => ({
      ...discipline,
      date: discipline.date ?? '',
    })),
  };

  return <SessionTable termResults={fixedTermResults} semesters={semesters} />;
}
