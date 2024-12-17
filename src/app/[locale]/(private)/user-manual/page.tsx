import { Heading1 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { SubLayout } from '../sub-layout';
import { Paragraph } from '@/components/typography/paragraph';
import { DownloadButton } from './download-button';
import { getTranslations } from 'next-intl/server';

const USER_MANUAL_URL = process.env.NEXT_PUBLIC_USER_MANUAL_URL!;

const INTL_NAMESPACE = 'private.user-manual';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function UserManualPage() {
  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6 xl:col-span-10">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="my-10">
          <DownloadButton url={USER_MANUAL_URL} />
        </Paragraph>
        <embed src={USER_MANUAL_URL} width="100%" height="1000" type="application/pdf" />
      </div>
    </SubLayout>
  );
}
