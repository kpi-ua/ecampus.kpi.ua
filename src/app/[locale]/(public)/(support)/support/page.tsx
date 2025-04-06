import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'public.support' });

  return {
    title: t('header'),
  };
}

export default function Support({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const t = useTranslations('public.support');

  return (
    <SupportNavLayout header={t('header')}>
      {t.rich('content', {
        tglink: (chunks) => <Link href="https://t.me/joinchat/HtJ6IROiP8Rv5BR-eZ64fw">{chunks}</Link>,
        addresslink: (chunks) => <Link href={process.env.NEXT_PUBLIC_ADDRESS_URL!}>{chunks}</Link>,
      })}
    </SupportNavLayout>
  );
}
