import { getTranslations } from 'next-intl/server';

import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';
import { type StudentMonitoringResult } from '@/types/models/dean';

export async function StudentMonitoringTable({ monitoring }: { monitoring: StudentMonitoringResult[] }) {
  const t = await getTranslations('private.dean');
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('sheet')}</TableHead>
          <TableHead>{t('studyYear')}</TableHead>
          <TableHead>{t('semester')}</TableHead>
          <TableHead>{t('discipline')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
          <TableHead>{t('assessment')}</TableHead>
          <TableHead>{t('date')}</TableHead>
          <TableHead>{t('result')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Show when={monitoring.length > 0} fallback={<TableEmptyRow colSpan={8}>{t('empty')}</TableEmptyRow>}>
          {monitoring.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.sheetId ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.studyYear ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.semester ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.discipline ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.lecturer ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.assessment ?? EMPTY_VALUE}</TableCell>
              <TableCell>{formatDate(row.assessmentDate) || EMPTY_VALUE}</TableCell>
              <TableCell>{row.mark ?? EMPTY_VALUE}</TableCell>
            </TableRow>
          ))}
        </Show>
      </TableBody>
    </Table>
  );
}
