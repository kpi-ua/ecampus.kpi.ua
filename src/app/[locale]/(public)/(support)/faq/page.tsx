import { useTranslations } from 'next-intl';
import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FrequentlyAskedQuestions } from '@/containers/faq/frequently-asked-questions';

const SECTIONS = ['how-to-register', 'how-to-restore-password'];

const INTL_NAMESPACE = 'public.faq';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default function FAQ({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SupportNavLayout header={t('header')}>
      <FrequentlyAskedQuestions i18nNamespace={INTL_NAMESPACE} sections={SECTIONS} />
    </SupportNavLayout>
  );
}
