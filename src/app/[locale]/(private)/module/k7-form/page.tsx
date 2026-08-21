import { getTranslations } from 'next-intl/server';

import { getK7FormFilters, getK7FormRequests } from '@/actions/k7-form.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocaleProps } from '@/types/locale-props';
import { K7_REPORT_REQUEST_STATUS, K7ReportRequest } from '@/types/models/k7-form';

import { K7ReportFilters } from './components/k7-report-filters';
import { K7ReportsTable } from './components/k7-reports-table';
import { K7RequestsRefresh } from './components/k7-requests-refresh';

const INTL_NAMESPACE = 'private.k-7';

type ReportTabValue = 'personal' | 'department';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function K7DashboardPage() {
  const [t, filters, personalReports] = await Promise.all([
    getTranslations(INTL_NAMESPACE),
    getK7FormFilters(),
    getK7FormRequests({}),
  ]);
  const hasDepartment = filters.lecturers.length > 0;
  const departmentReports = hasDepartment ? await getK7FormRequests({ all: true }) : [];
  // The directory arrives with the profiles of every lecturer, so the select is filled without
  // asking the API once per person. The fallback covers an API that predates the profiles field.
  const departmentProfiles = filters.lecturers.flatMap(({ profiles, ...lecturer }) =>
    (profiles ?? []).map((profile) => ({ ...lecturer, ...profile })),
  );
  const reports = { personal: personalReports, department: departmentReports };
  const departmentNames = Object.fromEntries(
    [...filters.profiles, ...departmentProfiles].map((profile) => [profile.departmentId, profile.departmentName]),
  );

  const tabs: { value: ReportTabValue; label: string }[] = [
    { value: 'personal', label: t('tabs.personal') },
    ...(hasDepartment ? [{ value: 'department' as const, label: t('tabs.department') }] : []),
  ];

  // While something is still being processed the grid re-fetches itself; DataReady counts because
  // the download button only appears once the file reaches Ready.
  const activeStatuses: K7ReportRequest['status'][] = [
    K7_REPORT_REQUEST_STATUS.Pending,
    K7_REPORT_REQUEST_STATUS.InProgress,
    K7_REPORT_REQUEST_STATUS.DataReady,
  ];
  const hasActiveRequests = [...personalReports, ...departmentReports].some((report) =>
    activeStatuses.includes(report.status),
  );
  const requestStatuses = Object.fromEntries(
    [...personalReports, ...departmentReports].map((report) => [report.k7ReportRequestId, report.status]),
  );

  return (
    <SubLayout pageTitle={t('title')}>
      <K7RequestsRefresh
        active={hasActiveRequests}
        statuses={requestStatuses}
        includeDepartment={hasDepartment}
      />
      <div className="col-span-12 flex w-full min-w-0 flex-col gap-4">
        <div>
          <Heading2>{t('title')}</Heading2>
          <Paragraph className="leading-sm mt-3 mb-7 max-w-full text-sm font-normal text-neutral-700 sm:max-w-2xl">
            {t('subtitle')}
          </Paragraph>
        </div>

        <Tabs defaultValue="personal" className="w-full min-w-0">
          <Card className="border-neutral-divider min-w-0 overflow-hidden rounded-lg border bg-white shadow-none">
            <TabsList className="border-neutral-divider h-12 w-full justify-start overflow-hidden rounded-t-lg rounded-b-none border-0 border-b bg-white p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:border-basic-blue data-[state=active]:text-basic-blue h-12 rounded-none border-b-2 border-transparent bg-white px-5 py-0 text-sm font-semibold text-neutral-400 data-[state=active]:bg-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="m-0 p-5">
                <K7ReportFilters
                  filters={filters}
                  reports={reports[tab.value]}
                  departmentProfiles={departmentProfiles}
                  type={tab.value}
                />
              </TabsContent>
            ))}
          </Card>

          {tabs.map((tab) => (
            <TabsContent key={`${tab.value}-table`} value={tab.value} className="mt-3">
              <K7ReportsTable
                reports={reports[tab.value]}
                departmentNames={departmentNames}
                all={tab.value === 'department'}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SubLayout>
  );
}
