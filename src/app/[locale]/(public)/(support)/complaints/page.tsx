import { useTranslations } from 'next-intl';
import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ComplaintsForm } from '@/components/complaints-form';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'public.complaints' });

  return {
    title: t('header'),
  };
}

export default function ComplaintsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const t = useTranslations('public.complaints');

  return (
    <SupportNavLayout header={t('header')} className="w-full grow">
      <ComplaintsForm className="-mx-[5%] w-[110%]" />
    </SupportNavLayout>
  );
}
