'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTableSort } from '@/hooks/use-table-sort';
import { formatDate } from '@/lib/utils';
import { DailyVisits } from '@/types/models/statistics';

interface Props {
  items: DailyVisits[];
}

export const VisitsTable = ({ items }: Props) => {
  const t = useTranslations('private.yiystat.visits');
  const { sortedRows, sortHandlers } = useTableSort(items, undefined, ['date', 'lecturers', 'students']);

  if (!items.length) {
    return <Paragraph className="my-0 py-12 text-center text-sm text-neutral-600">{t('empty')}</Paragraph>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead sortHandlers={sortHandlers} sortHeader="date">
            {t('date')}
          </TableHead>
          <TableHead sortHandlers={sortHandlers} sortHeader="lecturers">
            {t('lecturers')}
          </TableHead>
          <TableHead sortHandlers={sortHandlers} sortHeader="students">
            {t('students')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.map((item) => (
          <TableRow key={item.date}>
            <TableCell>{formatDate(item.date)}</TableCell>
            <TableCell>{item.lecturers}</TableCell>
            <TableCell>{item.students}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
