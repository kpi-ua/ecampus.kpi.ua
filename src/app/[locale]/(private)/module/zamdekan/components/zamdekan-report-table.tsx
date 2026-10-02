'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { Link } from '@/i18n/routing';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';

import { ReportCell, ZamdekanQuery, ZamdekanReport, ZamdekanView } from '../types';
import { formatReportCell } from '../utils/format-report-cell';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  report: ZamdekanReport;
  query: ZamdekanQuery;
}

export const ZamdekanReportTable = ({ report, query }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { sortedRows, sortHandlers } = useTableSort(report.rows, undefined, report.columns);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);
  const href = (view: ZamdekanView, values: Partial<Omit<ZamdekanQuery, 'view'>> = {}) =>
    getZamdekanReportPath({ ...query, ...values, view });
  const cellHref = (row: Record<string, ReportCell>, column: string): string | undefined => {
    if (column === 'StudyGroupName' && report.view === 'monitoring-groups') {
      return href('group-load', { groupId: Number(row.RtStudyGroupId) });
    }
    if (column === 'FIO' && report.view === 'agreements') {
      return href('results', { studentId: Number(row.StudentId), groupId: Number(row.RtStudyGroupId) });
    }
    if (column === 'fio' && report.view === 'employees') {
      return href('employee-load', { employeeId: Number(row.eEmployees1Id) });
    }
    if (
      ['DisciplineName', 'disciplineName'].includes(column) &&
      ['group-load', 'employee-load'].includes(report.view)
    ) {
      return href('sheets', { groupId: Number(row.RtStudyGroupId), disciplineId: Number(row.cRNPRowId) });
    }
    if (column === 'MonitoringName' && report.view === 'sheets') {
      return href('sheet', { monitoringId: Number(row.cMonitoringId) });
    }
    return undefined;
  };

  if (report.rows.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {report.columns.map((column) => (
              <TableHead key={column} sortHandlers={sortHandlers} sortHeader={column}>
                {t.has(`columns.${column}`) ? t(`columns.${column}`) : column.replace(/ \[\d+\]$/, '')}
              </TableHead>
            ))}
            {report.view === 'groups' && <TableHead>{t('actions')}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((row, index) => (
            <TableRow key={index}>
              {report.columns.map((column) => {
                const link = cellHref(row, column);
                const text = formatReportCell(row, column, t);
                return (
                  <TableCell key={column} className="whitespace-pre-wrap">
                    {link ? (
                      <Link href={link} className="underline">
                        {text}
                      </Link>
                    ) : (
                      text
                    )}
                  </TableCell>
                );
              })}
              {report.view === 'groups' && (
                <TableCell>
                  <Button asChild variant="secondary" size="small">
                    <Link href={href('agreements', { groupId: Number(row.RtStudyGroupId) })}>
                      {t('show-agreement')}
                    </Link>
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={report.rows.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={report.rows.length} />
      </Show>
    </div>
  );
};
