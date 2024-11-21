import { useTranslations } from 'next-intl';
import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: 'public.complaints'});

  return {
    title: t('header'),
  };
}

export default function ComplaintsPage() {
  const t = useTranslations('public.complaints');

  return (
    <SupportNavLayout header={t('header')} className="w-full grow">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSdlWaMSxcYVSfYDZpVgygSIl8reTZBM2Nl2ZzyuZzdaFwef_w/viewform?embedded=true"
        width="100%"
        height="950"
        className="-mx-[5%] w-[110%]"
      ></iframe>
    </SupportNavLayout>
  );
}
