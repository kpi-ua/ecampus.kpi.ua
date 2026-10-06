'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { Link } from '@/i18n/routing';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';

import { ZamdekanEmployee } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  employees: ZamdekanEmployee[];
}

export const ZamdekanEmployeesTable = ({ employees }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { sortedRows, sortHandlers } = useTableSort(employees, undefined, [
    'department',
    'fullName',
    'status',
    'contractEnd',
    'sheetCount',
  ]);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (employees.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="department">
              {t('columns.department')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="fullName">
              {t('columns.fullName')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="status">
              {t('columns.status')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="contractEnd">
              {t('columns.contractEnd')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="sheetCount">
              {t('columns.sheetCount')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((row) => (
            <TableRow key={row.employeeId}>
              <TableCell className="whitespace-pre-wrap">{row.department}</TableCell>
              <TableCell className="whitespace-pre-wrap">
                <Link
                  href={getZamdekanReportPath({ view: 'employee-load', employeeId: row.employeeId })}
                  className="underline"
                >
                  {row.fullName}
                </Link>
              </TableCell>
              <TableCell className="whitespace-pre-wrap">{row.status ?? ''}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.contractEnd ?? ''}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.sheetCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={employees.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={employees.length} />
      </Show>
    </div>
  );
};
