import { Heading1, Heading4 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Paragraph } from '@/components/typography/paragraph';

const INTL_NAMESPACE = 'private.about';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function AboutPage() {
  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-lg">
          {t.rich('content', {
            h4: (chunks) => <Heading4 className="mt-10">{chunks}</Heading4>,
          })}
        </Paragraph>
      </div>
    </SubLayout>
  );
}
