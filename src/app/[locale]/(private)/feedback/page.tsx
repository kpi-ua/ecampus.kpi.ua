import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ComplaintsForm } from '@/components/complaints-form';

const INTL_NAMESPACE = 'private.feedback';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function FeedbackPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations(INTL_NAMESPACE);
  return (
    <SubLayout pageTitle={t('title')} className="flex max-w-[640px] justify-start">
      <ComplaintsForm />
    </SubLayout>
  );
}
