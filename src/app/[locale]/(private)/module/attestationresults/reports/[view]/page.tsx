import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import {
  getAttestationReportGroups,
  getAttestationReportOptions,
  getAttestationReportStudents,
} from '@/actions/attestation-results.actions';
import { ReportDirectoryTable } from '@/app/[locale]/(private)/module/attestationresults/components/report-directory-table';
import { ReportFilters } from '@/app/[locale]/(private)/module/attestationresults/components/report-filters';
import { ReportNavigation } from '@/app/[locale]/(private)/module/attestationresults/components/report-navigation';
import {
  ATTESTATION_RESULTS_PATH,
  AttestationReportView,
} from '@/app/[locale]/(private)/module/attestationresults/constants';
import { getAttestationReportQuery } from '@/app/[locale]/(private)/module/attestationresults/utils/report-query';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';

const INTL_NAMESPACE = 'private.attestation-reports';
interface Props {
  params: Promise<{ locale: string; view: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
export const generateMetadata = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
};

export default async function AttestationDirectoryPage({ params, searchParams }: Props) {
  const { view } = await params;
  if (!Object.values(AttestationReportView).includes(view as AttestationReportView)) {
    notFound();
  }
  const selectedView = view as AttestationReportView;
  const t = await getTranslations(INTL_NAMESPACE);
  const options = await getAttestationReportOptions();
  const query = getAttestationReportQuery(await searchParams, options);
  const groups = await getAttestationReportGroups(query);
  const students = selectedView === AttestationReportView.Students ? await getAttestationReportStudents(query) : [];
  return (
    <SubLayout pageTitle={t('title')} breadcrumbs={[[ATTESTATION_RESULTS_PATH, t('title')]]}>
      <Card className="col-span-full flex min-w-0 flex-col gap-6 p-6">
        <Heading2>{t(`views.${selectedView}`)}</Heading2>
        <ReportNavigation view={selectedView} query={query} />
        <ReportFilters options={options} query={query} />
        <ReportDirectoryTable groups={groups} students={students} view={selectedView} query={query} />
      </Card>
    </SubLayout>
  );
}
