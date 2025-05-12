import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FrequentlyAskedQuestions } from '@/containers/faq/frequently-asked-questions';
import { LocaleProps } from '@/types/locale-props';

const SECTIONS = ['how-to-register', 'how-to-restore-password'];

const INTL_NAMESPACE = 'public.faq';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function FAQ({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SupportNavLayout header={t('header')}>
      <FrequentlyAskedQuestions i18nNamespace={INTL_NAMESPACE} sections={SECTIONS} />
    </SupportNavLayout>
  );
}
