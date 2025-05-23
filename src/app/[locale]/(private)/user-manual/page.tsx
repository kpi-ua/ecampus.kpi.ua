import { Heading1 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { DownloadButton } from './download-button';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Show } from '@/components/utils/show';
import { isIOS } from '@/lib/user-agent';
import { LocaleProps } from '@/types/locale-props';

const USER_MANUAL_URL = process.env.NEXT_PUBLIC_USER_MANUAL_URL!;

const INTL_NAMESPACE = 'private.user-manual';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function UserManualPage({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const isSafariMobile = await isIOS();
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6 xl:col-span-10">
        <Heading1>{t('title')}</Heading1>
        <DownloadButton className="my-10" url={USER_MANUAL_URL} />
        <Show when={!isSafariMobile}>
          <embed src={USER_MANUAL_URL} width="100%" height="1000" type="application/pdf" />
        </Show>
      </div>
    </SubLayout>
  );
}
