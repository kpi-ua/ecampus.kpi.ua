'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';

import { ZamdekanEmployeeActivity } from '../types';

interface Props {
  activities: ZamdekanEmployeeActivity[];
}

export const ZamdekanEmployeeActivityTable = ({ activities }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { sortedRows, sortHandlers } = useTableSort(activities, undefined, ['employee', 'department', 'date']);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (activities.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="employee">
              {t('columns.employee')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="department">
              {t('columns.department')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="date">
              {t('columns.date')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((row) => (
            <TableRow key={`${row.employeeId}-${row.date}`}>
              <TableCell className="whitespace-pre-wrap">{row.employee}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.department}</TableCell>
              <TableCell className="whitespace-pre-wrap">{dayjs(row.date).format('DD.MM.YYYY')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={activities.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={activities.length} />
      </Show>
    </div>
  );
};
