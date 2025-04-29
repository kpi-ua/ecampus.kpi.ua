import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SuggestionsForm } from '@/components/suggestions-form';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'public.suggestions';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function SuggestionPage({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SupportNavLayout header={t('header')} className="w-full grow">
      <SuggestionsForm className="-mx-[5%] w-[110%]" />
    </SupportNavLayout>
  );
}
