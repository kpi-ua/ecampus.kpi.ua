import { use } from 'react';
import { useTranslations } from 'next-intl';
import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SuggestionsForm } from '@/components/suggestions-form';
import { LocaleProps } from '@/types/props';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'public.suggestions' });

  return {
    title: t('header'),
  };
}

export default function SuggestionPage({ params }: LocaleProps) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations('public.suggestions');

  return (
    <SupportNavLayout header={t('header')} className="w-full grow">
      <SuggestionsForm className="-mx-[5%] w-[110%]" />
    </SupportNavLayout>
  );
}
