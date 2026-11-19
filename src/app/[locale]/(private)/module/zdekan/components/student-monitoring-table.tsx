import { useTranslations } from 'next-intl';

import { type getDeanOfficeStudent } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

const columns = ['sheet', 'studyYear', 'semester', 'discipline', 'lecturer', 'assessment', 'date', 'result'] as const;

export function StudentMonitoringTable({
  monitoring,
}: {
  monitoring: NonNullable<Awaited<ReturnType<typeof getDeanOfficeStudent>>>['monitoring'];
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
        {monitoring.length ? (
          monitoring.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.sheetId ?? '—'}</TableCell>
              <TableCell>{row.studyYear ?? '—'}</TableCell>
              <TableCell>{row.semester ?? '—'}</TableCell>
              <TableCell>{row.discipline ?? '—'}</TableCell>
              <TableCell>{row.lecturer ?? '—'}</TableCell>
              <TableCell>{row.assessment ?? '—'}</TableCell>
              <TableCell>{date(row.assessmentDate)}</TableCell>
              <TableCell>{row.mark ?? '—'}</TableCell>
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
