import { useLocale, useTranslations } from 'next-intl';

import { type getDeanOfficeLecturerSurveys } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/lib/utils';

const columns = ['studyYear', 'survey', 'course', 'criterion', 'responses', 'average', 'weightedAverage'] as const;

export function LecturerSurveyDetailsTable({
  details,
  lecturer,
}: {
  details: Awaited<ReturnType<typeof getDeanOfficeLecturerSurveys>>['surveys'][number]['details'];
  lecturer: string;
}) {
  const t = useTranslations('private.dean-office');
  const locale = useLocale();
  const score = (value: number | null) => (value === null ? '—' : formatNumber(value, 2, locale));
  return (
    <div className="pt-4">
      <h2 className="mb-4 text-xl font-semibold">{lecturer}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.length ? (
            details.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.studyYear ?? '—'}</TableCell>
                <TableCell>{row.survey ?? '—'}</TableCell>
                <TableCell>{row.course ?? '—'}</TableCell>
                <TableCell>{row.criterion ?? '—'}</TableCell>
                <TableCell>{row.responses ?? '—'}</TableCell>
                <TableCell>{score(row.average)}</TableCell>
                <TableCell>{score(row.weightedAverage)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>{t('empty')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
