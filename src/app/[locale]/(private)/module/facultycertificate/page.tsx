import { getTranslations } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { getAllFacultyCertificates, getOtherFacultyCertificate } from '@/actions/certificates.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import FacultyCertificatePageContent from './page.content';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';

const INTL_NAMESPACE = 'private.facultycertificate';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function FacultyCertificatePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const searchFilter = resolvedSearchParams.search || '';

  const facultyCertificates = await getAllFacultyCertificates({
    filter: searchFilter,
    page: resolvedSearchParams.page,
    size: PAGE_SIZE_DEFAULT.toString(),
  });

  const otherFacultyCertificates = await getOtherFacultyCertificate();

  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>

        <FacultyCertificatePageContent
          createdCertificates={otherFacultyCertificates.createdCertificates}
          allCertificates={facultyCertificates.allCertificates}
          approvedCertificates={otherFacultyCertificates.approvedCertificates}
          rejectedCertificates={otherFacultyCertificates.rejectedCertificates}
          totalCount={facultyCertificates.totalCount}
          searchFilter={searchFilter}
        />
      </div>
    </SubLayout>
  );
}
