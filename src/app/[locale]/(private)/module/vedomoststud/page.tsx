import { getTranslations } from 'next-intl/server';
import React from 'react';

import { getTerm } from '@/actions/term.actions';
import { LocaleProps } from '@/types/locale-props';

import SessionTable from './components/table';

const INTL_NAMESPACE = 'private.vedomoststud';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return { title: t('title') };
}

export default async function SessionPage() {
  const termResults = await getTerm();

  const fixedTermResults = {
    ...termResults,
    disciplines: termResults.disciplines.map((d: any) => ({
      ...d,
      date: d.date ?? '',
    })),
  };

  return <SessionTable termResults={fixedTermResults} />;
}
