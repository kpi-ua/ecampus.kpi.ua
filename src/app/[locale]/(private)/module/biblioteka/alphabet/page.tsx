import { getTranslations } from 'next-intl/server';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { LocaleProps } from '@/types/locale-props';

import { AlphabetBrowser } from './components/alphabet-browser';
import { BibliotekaTabs } from '../components/biblioteka-tabs';

const INTL_NAMESPACE = 'private.biblioteka';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('alphabet.title') };
}

export default async function AlphabetPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <BibliotekaTabs active="alphabet" />
        <AlphabetBrowser />
      </div>
    </SubLayout>
  );
}
