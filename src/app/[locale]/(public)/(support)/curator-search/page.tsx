import { use } from 'react';
import { useTranslations } from 'next-intl';
import { SupportNavLayout } from '../support-nav-layout';
import { CuratorSearch } from './curator-search';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleProps } from '@/types/props';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'public.curator-search' });

  return {
    title: t('header'),
  };
}

export default function CuratorSearchPage({ params }: LocaleProps) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations('public.curator-search');

  return (
    <SupportNavLayout header={t('header')} description={t('description')} className="flex w-full grow flex-col">
      <CuratorSearch />
    </SupportNavLayout>
  );
}
