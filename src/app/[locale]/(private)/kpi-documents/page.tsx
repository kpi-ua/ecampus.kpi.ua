import { use } from 'react';
import { Heading1 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { SubLayout } from '../sub-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BookBookmark, BookOpen, Roll } from '@/app/images';
import { DocumentCard } from './document-card';
import { LocaleProps } from '@/types/props';

const INTL_NAMESPACE = 'private.documents';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function KPIDocumentsPage({ params }: LocaleProps) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('header')} className="gap-8">
      <Heading1 className="col-span-full mb-6">{t('header')}</Heading1>
      <DocumentCard
        header={t('code-of-honor')}
        url={process.env.NEXT_PUBLIC_CODE_OF_HONOR!}
        BackgroundImage={BookBookmark}
        className="col-span-full lg:col-span-3 xl:col-span-3"
      />
      <DocumentCard
        header={t('internal-regulations')}
        url={process.env.NEXT_PUBLIC_INTERNAL_REGULATIONS!}
        BackgroundImage={BookOpen}
        className="col-span-full lg:col-span-3 xl:col-span-3"
      />
      <DocumentCard
        header={t('educational-organization-regulation')}
        url={process.env.NEXT_PUBLIC_EDUCATIONAL_ORGANIZATION_REGULATION!}
        BackgroundImage={Roll}
        className="col-span-full lg:col-span-3 xl:col-span-3"
      />
    </SubLayout>
  );
}
