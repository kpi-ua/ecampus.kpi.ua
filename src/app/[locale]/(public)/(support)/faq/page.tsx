import { useTranslations } from 'next-intl';
import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: 'public.faq' });

  return {
    title: t('header'),
  };
}

export default function FAQ({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const t = useTranslations('public.faq');

  return <SupportNavLayout header={t('header')}>{t.rich('content')}</SupportNavLayout>;
}
