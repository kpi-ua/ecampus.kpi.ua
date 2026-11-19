import { getTranslations } from 'next-intl/server';

import { getDeanOfficeSessionResults } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';

export async function StudentSessionTable({ studentId }: { studentId: number }) {
  const [t, results] = await Promise.all([
    getTranslations('private.dean-office'),
    getDeanOfficeSessionResults(studentId).catch(() => null),
  ]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('discipline')}</TableHead>
          <TableHead>{t('assessment')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
          <TableHead>{t('date')}</TableHead>
          <TableHead>{t('result')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Show
          when={(results?.length ?? 0) > 0}
          fallback={<TableEmptyRow colSpan={5}>{t(results === null ? 'sessionLoadError' : 'empty')}</TableEmptyRow>}
        >
          {results?.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.disciplineName ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.studyTypeName ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.employeeName ?? EMPTY_VALUE}</TableCell>
              <TableCell>{formatDate(row.examDate) || EMPTY_VALUE}</TableCell>
              <TableCell>{row.mark ?? EMPTY_VALUE}</TableCell>
            </TableRow>
          ))}
        </Show>
      </TableBody>
    </Table>
  );
}
