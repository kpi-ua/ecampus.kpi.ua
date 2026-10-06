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

import { ZamdekanEmployeeDiscipline } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  disciplines: ZamdekanEmployeeDiscipline[];
}

export const ZamdekanEmployeeDisciplinesTable = ({ disciplines }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { sortedRows, sortHandlers } = useTableSort(disciplines, undefined, [
    'group',
    'employee',
    'discipline',
    'teachingTypes',
    'sheetCount',
  ]);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (disciplines.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="group">
              {t('columns.group')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="employee">
              {t('columns.employee')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="discipline">
              {t('columns.discipline')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="teachingTypes">
              {t('columns.teachingTypes')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="sheetCount">
              {t('columns.sheetCount')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((row) => (
            <TableRow key={`${row.groupId}-${row.disciplineId}`}>
              <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.employee}</TableCell>
              <TableCell className="whitespace-pre-wrap">
                <Link
                  href={getZamdekanReportPath({
                    view: 'sheets',
                    employeeId: row.employeeId,
                    groupId: row.groupId,
                    disciplineId: row.disciplineId,
                  })}
                  className="underline"
                >
                  {row.discipline}
                </Link>
              </TableCell>
              <TableCell className="whitespace-pre-wrap">{row.teachingTypes ?? ''}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.sheetCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={disciplines.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={disciplines.length} />
      </Show>
    </div>
  );
};
