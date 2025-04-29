import { Link } from '@/i18n/routing';
import { SupportNavLayout } from '../support-nav-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import RichText from '@/components/typography/rich-text';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'public.support' });

  return {
    title: t('header'),
  };
}

export default async function Support({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('public.support');

  return (
    <SupportNavLayout header={t('header')}>
      <RichText>
        {(tags) =>
          t.rich('content', {
            ...tags,
            tglink: (chunks) => <Link href="https://t.me/joinchat/HtJ6IROiP8Rv5BR-eZ64fw">{chunks}</Link>,
            addresslink: (chunks) => <Link href={process.env.NEXT_PUBLIC_ADDRESS_URL!}>{chunks}</Link>,
          })
        }
      </RichText>
    </SupportNavLayout>
  );
}
