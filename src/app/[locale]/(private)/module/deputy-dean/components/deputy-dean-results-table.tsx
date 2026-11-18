'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';

import { DeputyDeanExamStatus, DeputyDeanMarkStatus } from '../constants';
import { DeputyDeanExamResult } from '../types';
import { DeputyDeanTableCard } from './deputy-dean-table-card';

interface Props {
  results: DeputyDeanExamResult[];
}

export const DeputyDeanResultsTable = ({ results }: Props) => {
  const t = useTranslations('private.deputy-dean');
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
  const markLabels = {
    [DeputyDeanMarkStatus.Missing]: '',
    [DeputyDeanMarkStatus.NotAdmitted]: t('values.not-admitted'),
    [DeputyDeanMarkStatus.NotGraded]: t('values.not-graded'),
  };
  const statusLabels = {
    [DeputyDeanExamStatus.Submitted]: t('values.submitted'),
    [DeputyDeanExamStatus.Closed]: t('values.closed'),
    [DeputyDeanExamStatus.Pending]: t('values.pending'),
    [DeputyDeanExamStatus.Editing]: t('values.editing'),
  };
  if (results.length === 0) {
    return <Paragraph className="py-12 text-center text-sm text-muted-foreground">{t('empty')}</Paragraph>;
  }

  return (
    <div className="space-y-4">
      <DeputyDeanTableCard>
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
                <TableCell className="whitespace-pre-wrap">{formatDate(row.eventDate)}</TableCell>
                <TableCell className="whitespace-pre-wrap">{row.discipline}</TableCell>
                <TableCell className="whitespace-pre-wrap">{row.controlForm}</TableCell>
                <TableCell className="whitespace-pre-wrap">{row.examiner}</TableCell>
                <TableCell className="whitespace-pre-wrap">
                  {row.markStatus === DeputyDeanMarkStatus.Graded ? row.mark : markLabels[row.markStatus]}
                </TableCell>
                <TableCell className="whitespace-pre-wrap">{row.nationalScale ?? ''}</TableCell>
                <TableCell className="whitespace-pre-wrap">{statusLabels[row.status]}</TableCell>
                <TableCell className="whitespace-pre-wrap">{formatDate(row.opensAt)}</TableCell>
                <TableCell className="whitespace-pre-wrap">{formatDate(row.closesAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DeputyDeanTableCard>
      <Show when={results.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={results.length} />
      </Show>
    </div>
  );
};
