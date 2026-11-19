import { getLocale, getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDeanOfficeLecturerSurveys } from '@/actions/dean-office.actions';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatNumber } from '@/lib/utils';
import { type LocaleProps } from '@/types/locale-props';

import { DeanOfficeDepartmentFilter } from '../../../components/dean-office-department-filter';
import { loadSurveySearchParams } from '../../../search-params';
import { getDeanOfficeDepartmentSelection } from '../../../utils/dean-office-departments';
import { LecturerSurveyDetailsTable } from './components/lecturer-survey-details-table';
import { LecturerSurveyRow } from './components/lecturer-survey-row';

const INTL_NAMESPACE = 'private.dean-office';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('lecturerSurveys'),
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await loadSurveySearchParams(searchParams);
  const { departments, selected } = await getDeanOfficeDepartmentSelection(params.departmentId);
  const surveyPage = departments.length
    ? await getDeanOfficeLecturerSurveys({
        departmentId: selected?.id,
        page: params.page,
      })
    : null;

  const t = await getTranslations(INTL_NAMESPACE);
  const locale = await getLocale();
  const score = (value: number | null) => (value === null ? EMPTY_VALUE : formatNumber(value, 2, locale));

  const { pageSize = 1, totalCount = 0 } = surveyPage ?? {};

  return (
    <Card className="min-w-0 rounded-t-none p-6">
      <DeanOfficeDepartmentFilter departments={departments} />
      <Heading2 className="mb-3 text-lg leading-7 lg:text-lg lg:leading-7">{t('lecturerSurveys')}</Heading2>
      <Table aria-label={t('lecturerSurveys')}>
        <TableHeader>
          <TableRow>
            <TableHead>{t('lecturer')}</TableHead>
            <TableHead>{t('responses')}</TableHead>
            <TableHead>{t('average')}</TableHead>
            <TableHead>{t('weightedAverage')}</TableHead>
            <TableHead className="w-16">{null}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={surveyPage?.surveys.length === 0}>
            <TableEmptyRow colSpan={5}>{t('empty')}</TableEmptyRow>
          </Show>
          {surveyPage?.surveys.map((survey) => (
            <LecturerSurveyRow
              key={survey.employeeId}
              lecturer={survey.lecturer}
              responses={survey.responses}
              average={score(survey.average)}
              weightedAverage={score(survey.weightedAverage)}
            >
              <LecturerSurveyDetailsTable lecturer={survey.lecturer} details={survey.details} />
            </LecturerSurveyRow>
          ))}
        </TableBody>
      </Table>
      <Show when={totalCount > pageSize}>
        <div className="mt-4">
          <PaginationWithLinks page={params.page} pageSize={pageSize} totalCount={totalCount} />
        </div>
      </Show>
    </Card>
  );
}
