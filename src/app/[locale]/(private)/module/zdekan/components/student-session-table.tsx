import { useTranslations } from 'next-intl';

import { type getDeanOfficeSessionResults } from '@/actions/dean-office.actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

const columns = ['discipline', 'assessment', 'lecturer', 'date', 'result'] as const;

export function StudentSessionTable({
  results,
  isPending,
  isError,
}: {
  results: Awaited<ReturnType<typeof getDeanOfficeSessionResults>>;
  isPending: boolean;
  isError: boolean;
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
        {results.length ? (
          results.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.disciplineName ?? '—'}</TableCell>
              <TableCell>{row.studyTypeName ?? '—'}</TableCell>
              <TableCell>{row.employeeName ?? '—'}</TableCell>
              <TableCell>{date(row.examDate)}</TableCell>
              <TableCell>{row.mark ?? '—'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length}>
              {isPending ? <Skeleton className="h-8 w-full" /> : t(isError ? 'sessionLoadError' : 'empty')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
