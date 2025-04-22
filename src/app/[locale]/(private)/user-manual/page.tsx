import { use } from 'react';
import { Heading1 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { SubLayout } from '../sub-layout';
import { DownloadButton } from './download-button';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Show } from '@/components/utils/show';
import { isIOS } from '@/lib/user-agent';

interface Props {
  params: Promise<{ locale: string }>;
}

const USER_MANUAL_URL = process.env.NEXT_PUBLIC_USER_MANUAL_URL!;

const INTL_NAMESPACE = 'private.user-manual';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function UserManualPage({ params }: Props) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const isSafariMobile = use(isIOS());
  const t = useTranslations(INTL_NAMESPACE);

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
