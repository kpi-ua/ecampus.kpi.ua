import { getTranslations } from 'next-intl/server';

import { getK7FormFilters, getK7FormRequests } from '@/actions/k7-form.actions';
import { Heading2, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocaleProps } from '@/types/locale-props';
import { K7FormLecturer } from '@/types/models/k7-form';

import { K7ReportFilters } from './components/k7-report-filters';
import { K7ReportsTable } from './components/k7-reports-table';

const INTL_NAMESPACE = 'private.k-reports.k-7';

type ReportTabValue = 'personal' | 'department';

const getDepartmentProfiles = async (lecturers: K7FormLecturer[]) => {
  const profileGroups = await Promise.all(
    lecturers.map(async (lecturer) => {
      const { profiles } = await getK7FormFilters(lecturer.userAccountId);

      return profiles.map((profile) => ({ ...lecturer, ...profile }));
    }),
  );

  return profileGroups.flat();
};

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
  const [departmentReports, departmentProfiles] =
    filters.lecturers.length > 0
      ? await Promise.all([getK7FormRequests({ all: true }), getDepartmentProfiles(filters.lecturers)])
      : [[], []];
  const reports = { personal: personalReports, department: departmentReports };
  const departmentNames = Object.fromEntries(
    [...filters.profiles, ...departmentProfiles].map((profile) => [profile.departmentId, profile.departmentName]),
  );

  const tabs: { value: ReportTabValue; label: string }[] = [
    { value: 'personal', label: t('tabs.personal') },
    ...(filters.lecturers.length > 0 ? [{ value: 'department' as const, label: t('tabs.department') }] : []),
  ];

  return (
    <main className="mx-auto flex w-full max-w-[1000px] min-w-0 flex-col gap-4">
      <header className="flex flex-col">
        <div>
          <Heading2 className="leading-3xl lg:leading-3xl text-3xl text-neutral-900 lg:text-3xl">{t('title')}</Heading2>
          <Paragraph className="leading-sm mt-2 mb-6 max-w-3xl text-sm font-normal text-neutral-700">
            {t('subtitle')}
          </Paragraph>
        </div>
      </header>

      <Tabs defaultValue="personal" className="w-full min-w-0">
        <Card className="border-neutral-divider min-w-0 overflow-hidden rounded-[16px] border bg-white shadow-none">
          <TabsList className="border-neutral-divider h-12 w-full justify-start overflow-hidden rounded-t-[16px] rounded-b-none border-0 border-b bg-white p-0">
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
              <K7ReportFilters filters={filters} departmentProfiles={departmentProfiles} type={tab.value} />
            </TabsContent>
          ))}
        </Card>

        {tabs.map((tab) => (
          <TabsContent key={`${tab.value}-table`} value={tab.value} className="mt-3">
            <K7ReportsTable reports={reports[tab.value]} departmentNames={departmentNames} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
