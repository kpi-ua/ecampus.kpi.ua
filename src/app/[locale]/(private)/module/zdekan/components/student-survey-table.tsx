import { useTranslations } from 'next-intl';

import { type getDeanOfficeStudent } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

const columns = ['studyYear', 'survey', 'lecturer', 'date'] as const;

export function StudentSurveyTable({
  surveys,
}: {
  surveys: NonNullable<Awaited<ReturnType<typeof getDeanOfficeStudent>>>['surveys'];
}) {
  const t = useTranslations('private.dean-office');
  const date = (value: string | null) => (value ? formatDate(value) : '—');
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>{t(column)}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {surveys.length ? (
          surveys.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.studyYear ?? '—'}</TableCell>
              <TableCell>{row.survey ?? '—'}</TableCell>
              <TableCell>{row.lecturer ?? '—'}</TableCell>
              <TableCell>{date(row.submittedAt)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length}>{t('empty')}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
