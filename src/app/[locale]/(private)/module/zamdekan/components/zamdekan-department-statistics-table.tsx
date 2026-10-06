'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';

import { ZamdekanDepartmentStatistics } from '../types';

interface Props {
  statistics: ZamdekanDepartmentStatistics[];
}

export const ZamdekanDepartmentStatisticsTable = ({ statistics }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { sortedRows, sortHandlers } = useTableSort(statistics, undefined, [
    'recipientDepartment',
    'group',
    'discipline',
    'semester',
    'teachingDepartment',
    'lecturers',
    'markCount',
  ]);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (statistics.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="recipientDepartment">
              {t('columns.recipientDepartment')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="group">
              {t('columns.group')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="discipline">
              {t('columns.discipline')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="semester">
              {t('columns.semester')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="teachingDepartment">
              {t('columns.teachingDepartment')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="lecturers">
              {t('columns.lecturers')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="markCount">
              {t('columns.markCount')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((row) => (
            <TableRow key={`${row.departmentId}-${row.groupId}-${row.disciplineId}`}>
              <TableCell className="whitespace-pre-wrap">{row.recipientDepartment}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.discipline}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.semester}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.teachingDepartment}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.lecturers ?? ''}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.markCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={statistics.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={statistics.length} />
      </Show>
    </div>
  );
};
