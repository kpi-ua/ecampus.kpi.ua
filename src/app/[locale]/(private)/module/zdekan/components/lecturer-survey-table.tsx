import { useLocale, useTranslations } from 'next-intl';

import { type getDeanOfficeLecturerSurveys } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/lib/utils';

import { LecturerSurveyDetailsTable } from './lecturer-survey-details-table';
import { LecturerSurveyRow } from './lecturer-survey-row';

type Surveys = Awaited<ReturnType<typeof getDeanOfficeLecturerSurveys>>['surveys'];

export function LecturerSurveyTable({ surveys }: { surveys: Surveys }) {
  const t = useTranslations('private.dean-office');
  const locale = useLocale();
  const score = (value: number | null) => (value === null ? '—' : formatNumber(value, 2, locale));
  const columns = ['lecturer', 'responses', 'average', 'weightedAverage'] as const;
  return (
    <>
      <h2 className="mb-3 text-lg font-semibold">{t('lecturerSurveys')}</h2>
      <Table aria-label={t('lecturerSurveys')}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
            <TableHead className="w-16">{null}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + 1}>{t('empty')}</TableCell>
            </TableRow>
          )}
          {surveys.map((survey) => (
            <LecturerSurveyRow
              key={survey.employeeId}
              lecturer={survey.lecturer}
              scores={[survey.responses, score(survey.average), score(survey.weightedAverage)]}
            >
              <LecturerSurveyDetailsTable lecturer={survey.lecturer} details={survey.details} />
            </LecturerSurveyRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
