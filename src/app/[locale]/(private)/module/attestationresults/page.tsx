import { getTranslations } from 'next-intl/server';

import {
  getAttestationReportGroups,
  getAttestationReportOptions,
  getAttestationReportStudents,
} from '@/actions/attestation-results.actions';
import { getAttestationResults } from '@/actions/attestation.actions';
import { getUserDetails } from '@/actions/auth.actions';
import { AttestationBadge } from '@/app/[locale]/(private)/module/attestationresults/components/attestation-badge';
import { AttestationHeader } from '@/app/[locale]/(private)/module/attestationresults/components/attestation-header';
import { ReportCoursesTable } from '@/app/[locale]/(private)/module/attestationresults/components/report-courses-table';
import { ReportDepartmentTable } from '@/app/[locale]/(private)/module/attestationresults/components/report-department-table';
import { ReportFilters } from '@/app/[locale]/(private)/module/attestationresults/components/report-filters';
import { ReportGroupsTable } from '@/app/[locale]/(private)/module/attestationresults/components/report-groups-table';
import { ReportStudentsTable } from '@/app/[locale]/(private)/module/attestationresults/components/report-students-table';
import { AttestationReportView } from '@/app/[locale]/(private)/module/attestationresults/constants';
import { getAttestationReportQuery } from '@/app/[locale]/(private)/module/attestationresults/utils/report-query';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';
import { LocaleProps } from '@/types/locale-props';
import { Attestation } from '@/types/models/attestation-results/attestation-result';

const INTL_NAMESPACE = 'private.attestation-results';

interface Props extends LocaleProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

const SEMESTERS = [1, 2];
const ATTESTATION_NUMBERS = [1, 2];

export default async function AttestationResultsPage({ searchParams }: Props) {
  const user = await getUserDetails();
  if (user && !user.studentProfile) {
    const t = await getTranslations('private.attestation-reports');
    const options = await getAttestationReportOptions();
    const query = getAttestationReportQuery(await searchParams, options);
    const [groups, students] = await Promise.all([
      getAttestationReportGroups(query),
      getAttestationReportStudents(query),
    ]);
    return (
      <Card className="col-span-full flex min-w-0 flex-col gap-6 p-6">
        <Tabs defaultValue={AttestationReportView.Groups}>
          <div className="overflow-x-auto">
            <TabsList className="bg-white" size="small">
              {Object.values(AttestationReportView).map((view) => (
                <TabsTrigger key={view} value={view}>
                  {t(`views.${view}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="my-6">
            <ReportFilters options={options} query={query} />
          </div>
          <TabsContent value={AttestationReportView.Groups}>
            <ReportGroupsTable groups={groups} query={query} />
          </TabsContent>
          <TabsContent value={AttestationReportView.Courses}>
            <ReportCoursesTable groups={groups} query={query} />
          </TabsContent>
          <TabsContent value={AttestationReportView.Department}>
            <ReportDepartmentTable groups={groups} query={query} />
          </TabsContent>
          <TabsContent value={AttestationReportView.Students}>
            <ReportStudentsTable groups={groups} students={students} query={query} />
          </TabsContent>
        </Tabs>
      </Card>
    );
  }
  const results = await getAttestationResults();

  const t = await getTranslations(INTL_NAMESPACE);

  const getAttestationResult = (attestations: Attestation[], semester: number, number: number) => {
    const attestation = attestations.find((att) => att.semester === semester && att.number === number);
    return attestation ? attestation.result : null;
  };

  const hasResults = results.some((result) =>
    SEMESTERS.some((semester) =>
      ATTESTATION_NUMBERS.some((number) => getAttestationResult(result.attestations, semester, number) !== null),
    ),
  );

  return (
    <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('subject')}</TableHead>
            <TableHead>{t('lecturer')}</TableHead>
            {SEMESTERS.map((semester) =>
              ATTESTATION_NUMBERS.map((number) => (
                <AttestationHeader key={`${semester}-${number}`} attestationNumber={number} semesterNumber={semester} />
              )),
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {!hasResults ? (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={6} className="h-[212px] text-center text-neutral-500">
                <Paragraph className="m-0 text-lg font-semibold">{t('empty.title')}</Paragraph>
                <Paragraph className="m-0 mt-2 text-base">{t('empty.description')}</Paragraph>
              </TableCell>
            </TableRow>
          ) : (
            results.map((result, index) => (
              <TableRow key={index}>
                <TableCell className="max-w-[336px] min-w-[200px]">
                  {result.id ? (
                    <Link
                      className="text-sm font-medium text-basic-black underline"
                      href={`/module/studysheet/${result.id}`}
                    >
                      {result.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-basic-black">{result.name}</span>
                  )}
                </TableCell>

                <TableCell className="max-w-[360px]">
                  <LecturerItemCell photo={result.lecturer.photo} fullName={result.lecturer.fullName} />
                </TableCell>
                {SEMESTERS.map((semester) =>
                  ATTESTATION_NUMBERS.map((number) => {
                    const currentResult = getAttestationResult(result?.attestations, semester, number);
                    return (
                      <TableCell key={`${semester}-${number}`}>
                        {currentResult !== null && <AttestationBadge result={currentResult} />}
                      </TableCell>
                    );
                  }),
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
