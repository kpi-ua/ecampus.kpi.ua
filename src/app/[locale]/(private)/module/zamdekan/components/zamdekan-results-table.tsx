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

import { ZamdekanExamResult } from '../types';
import { formatZamdekanMark } from '../utils/format-mark';

interface Props {
  results: ZamdekanExamResult[];
}

export const ZamdekanResultsTable = ({ results }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { sortedRows, sortHandlers } = useTableSort(results, undefined, [
    'part',
    'eventDate',
    'discipline',
    'controlForm',
    'examiner',
    'mark',
    'nationalScale',
    'status',
    'opensAt',
    'closesAt',
  ]);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);
  const getStatus = (result: ZamdekanExamResult) => {
    if (result.status === 1) return t('values.submitted');
    if (result.closesAt && dayjs().isAfter(dayjs(result.closesAt))) return t('values.closed');
    if (result.opensAt && dayjs().isBefore(dayjs(result.opensAt))) return t('values.pending');
    return t('values.editing');
  };
  if (results.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="part">
              {t('columns.part')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="eventDate">
              {t('columns.eventDate')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="discipline">
              {t('columns.discipline')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="controlForm">
              {t('columns.controlForm')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="examiner">
              {t('columns.examiner')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="mark">
              {t('columns.mark')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="nationalScale">
              {t('columns.nationalScale')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="status">
              {t('columns.examStatus')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="opensAt">
              {t('columns.opensAt')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="closesAt">
              {t('columns.closesAt')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((row, index) => (
            <TableRow key={`${row.discipline}-${row.part}-${row.eventDate}-${index}`}>
              <TableCell className="whitespace-pre-wrap">
                {[0, 1, 2].includes(row.part) ? t(`values.part-${row.part}`) : row.part}
              </TableCell>
              <TableCell className="whitespace-pre-wrap">
                {row.eventDate ? dayjs(row.eventDate).format('DD.MM.YYYY') : ''}
              </TableCell>
              <TableCell className="whitespace-pre-wrap">{row.discipline}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.controlForm}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.examiner}</TableCell>
              <TableCell className="whitespace-pre-wrap">{formatZamdekanMark(row.mark, t)}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.nationalScale ?? ''}</TableCell>
              <TableCell className="whitespace-pre-wrap">{getStatus(row)}</TableCell>
              <TableCell className="whitespace-pre-wrap">
                {row.opensAt ? dayjs(row.opensAt).format('DD.MM.YYYY') : ''}
              </TableCell>
              <TableCell className="whitespace-pre-wrap">
                {row.closesAt ? dayjs(row.closesAt).format('DD.MM.YYYY') : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={results.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={results.length} />
      </Show>
    </div>
  );
};
