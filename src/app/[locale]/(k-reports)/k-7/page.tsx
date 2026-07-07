import { getTranslations } from 'next-intl/server';

import { Heading2, Paragraph } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.k-reports.k-7';

type ReportStatus = 'ready' | 'inProgress' | 'error';
type ReportTabValue = 'personal' | 'department';

interface ReportRow {
  id: string;
  createdAt: string;
  academicYear: string;
  department: string;
  positionKey: 'associateProfessor' | 'seniorLecturer';
  status: ReportStatus;
  canView: boolean;
  canDownload: boolean;
}

const ACADEMIC_YEARS = ['2024-2025', '2023-2024'];

const PROFILE_OPTIONS = [
  {
    value: 'auts-associate-professor',
    labelKey: 'autsAssociateProfessor',
  },
  {
    value: 'auts-senior-lecturer',
    labelKey: 'autsSeniorLecturer',
  },
];

const REPORTS: Record<ReportTabValue, ReportRow[]> = {
  personal: [
    {
      id: 'personal-2025-ready',
      createdAt: '04.06.2025, 20:14',
      academicYear: '2024-2025',
      department: 'АУТС',
      positionKey: 'associateProfessor',
      status: 'ready',
      canView: true,
      canDownload: true,
    },
    {
      id: 'personal-2024-ready',
      createdAt: '14.06.2024, 11:03',
      academicYear: '2023-2024',
      department: 'АУТС',
      positionKey: 'associateProfessor',
      status: 'inProgress',
      canView: false,
      canDownload: false,
    },
    {
      id: 'personal-2025-error',
      createdAt: '04.06.2025, 20:14',
      academicYear: '2024-2025',
      department: 'АУТС',
      positionKey: 'associateProfessor',
      status: 'error',
      canView: false,
      canDownload: false,
    },
  ],
  department: [
    {
      id: 'department-2025-ready',
      createdAt: '04.06.2025, 20:14',
      academicYear: '2024-2025',
      department: 'АУТС',
      positionKey: 'associateProfessor',
      status: 'ready',
      canView: true,
      canDownload: true,
    },
    {
      id: 'department-2024-ready',
      createdAt: '14.06.2024, 11:03',
      academicYear: '2023-2024',
      department: 'АУТС',
      positionKey: 'seniorLecturer',
      status: 'inProgress',
      canView: false,
      canDownload: false,
    },
    {
      id: 'department-2025-error',
      createdAt: '04.06.2025, 20:14',
      academicYear: '2024-2025',
      department: 'АУТС',
      positionKey: 'associateProfessor',
      status: 'error',
      canView: false,
      canDownload: false,
    },
  ],
};

const statusBadgeClassName: Record<ReportStatus, string> = {
  ready: 'border-status-success-300 bg-status-success-100 text-status-success-300',
  inProgress: 'border-other-blue bg-other-blue/10 text-other-blue',
  error: 'border-status-danger-300 bg-status-danger-100 text-status-danger-300',
};

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function K7DashboardPage() {
  const t = await getTranslations(INTL_NAMESPACE);

  const tabs: { value: ReportTabValue; label: string }[] = [
    { value: 'personal', label: t('tabs.personal') },
    { value: 'department', label: t('tabs.department') },
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
              <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="flex min-w-0 flex-col gap-2">
                  <Label htmlFor={`academic-year-${tab.value}`}>{t('filters.academicYear')}</Label>
                  <Select defaultValue={ACADEMIC_YEARS[0]}>
                    <SelectTrigger
                      id={`academic-year-${tab.value}`}
                      variant="small"
                      className="border-neutral-300 text-sm text-neutral-900"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACADEMIC_YEARS.map((academicYear) => (
                        <SelectItem key={academicYear} value={academicYear}>
                          {academicYear}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <Label htmlFor={`work-profile-${tab.value}`}>{t('filters.workProfile')}</Label>
                  <Select defaultValue={PROFILE_OPTIONS[0].value}>
                    <SelectTrigger
                      id={`work-profile-${tab.value}`}
                      variant="small"
                      className="border-neutral-300 text-sm text-neutral-900"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFILE_OPTIONS.map((profile) => (
                        <SelectItem key={profile.value} value={profile.value}>
                          {t(`profiles.${profile.labelKey}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end lg:col-span-2">
                  <Button size="small" className="h-10 w-full rounded-[8px] px-4 py-0 text-xs sm:w-auto">
                    {t('actions.generate')}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Card>

        {tabs.map((tab) => (
          <TabsContent key={`${tab.value}-table`} value={tab.value} className="mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px] bg-neutral-50 text-xs normal-case">
                    {t('table.createdAt')}
                  </TableHead>
                  <TableHead className="min-w-[120px] bg-neutral-50 text-xs normal-case">
                    {t('table.academicYear')}
                  </TableHead>
                  <TableHead className="min-w-[120px] bg-neutral-50 text-xs normal-case">
                    {t('table.department')}
                  </TableHead>
                  <TableHead className="min-w-[120px] bg-neutral-50 text-xs normal-case">
                    {t('table.position')}
                  </TableHead>
                  <TableHead className="min-w-[120px] bg-neutral-50 text-xs normal-case">{t('table.status')}</TableHead>
                  <TableHead className="min-w-[240px] bg-neutral-50 text-right text-xs normal-case">
                    {t('table.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REPORTS[tab.value].map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="py-4 font-normal whitespace-nowrap">{report.createdAt}</TableCell>
                    <TableCell>{report.academicYear}</TableCell>
                    <TableCell>{report.department}</TableCell>
                    <TableCell>{t(`positions.${report.positionKey}`)}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'leading-xs justify-center rounded-[8px] border px-4 py-[5px] text-xs font-semibold',
                          statusBadgeClassName[report.status],
                        )}
                      >
                        {t(`status.${report.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {report.canView || report.canDownload ? (
                        <div className="flex justify-end gap-2">
                          {report.canView && (
                            <Button
                              asChild
                              variant="secondary"
                              size="small"
                              className="h-10 rounded-[8px] px-5 py-0 text-xs"
                            >
                              <Link href="/k-7/preview">{t('actions.view')}</Link>
                            </Button>
                          )}
                          {report.canDownload && (
                            <Button variant="secondary" size="small" className="h-10 rounded-[8px] px-5 py-0 text-xs">
                              {t('actions.downloadPdf')}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex h-10 items-center justify-center px-3 text-neutral-700">--</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
