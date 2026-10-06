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

import { ZamdekanMonitoringSheet } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  sheets: ZamdekanMonitoringSheet[];
  employeeId: number;
}

export const ZamdekanEmployeeSheetsTable = ({ sheets, employeeId }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { sortedRows, sortHandlers } = useTableSort(sheets, undefined, [
    'group',
    'discipline',
    'name',
    'employee',
    'assessmentCount',
    'markCount',
  ]);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (sheets.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="group">
              {t('columns.group')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="discipline">
              {t('columns.discipline')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="name">
              {t('columns.name')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="employee">
              {t('columns.employee')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="assessmentCount">
              {t('columns.assessmentCount')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="markCount">
              {t('columns.markCount')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((row) => (
            <TableRow key={row.employeeSheetId}>
              <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.discipline}</TableCell>
              <TableCell className="whitespace-pre-wrap">
                <Link
                  href={getZamdekanReportPath({
                    view: 'sheet',
                    groupId: row.groupId,
                    disciplineId: row.disciplineId,
                    monitoringId: row.sheetId,
                    employeeId,
                  })}
                  className="underline"
                >
                  {row.name || t('values.unnamed-sheet')}
                </Link>
              </TableCell>
              <TableCell className="whitespace-pre-wrap">{row.employee}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.assessmentCount}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.markCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={sheets.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={sheets.length} />
      </Show>
    </div>
  );
};
