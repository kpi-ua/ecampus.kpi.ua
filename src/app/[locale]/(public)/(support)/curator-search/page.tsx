import { SupportNavLayout } from '../support-nav-layout';
import { CuratorSearch } from './curator-search';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'public.curator-search';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function CuratorSearchPage({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SupportNavLayout header={t('header')} description={t('description')} className="flex w-full grow flex-col">
      <CuratorSearch />
    </SupportNavLayout>
  );
}
