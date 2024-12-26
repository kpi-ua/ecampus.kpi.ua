import { useTranslations } from 'next-intl';
import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: any) {
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
      <iframe
        src={process.env.NEXT_PUBLIC_COMPLAINTS_FORM!}
        width="100%"
        height="950"
        className="-mx-[5%] w-[110%]"
      ></iframe>
    </SupportNavLayout>
  );
}
