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
import { SurveyParticipation } from '@/types/models/statistics';

interface Props {
  items: SurveyParticipation[];
}

export const SurveyParticipationTable = ({ items }: Props) => {
  const t = useTranslations('private.yiystat.surveys');
  const { sortedRows, sortHandlers } = useTableSort(items, undefined, [
    'id',
    'studyYear',
    'startsOn',
    'endsOn',
    'respondentCount',
  ]);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (!items.length) {
    return <Paragraph className="my-0 py-12 text-center text-sm text-neutral-600">{t('empty')}</Paragraph>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="id">
              {t('id')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="studyYear">
              {t('year')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="startsOn">
              {t('start')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="endsOn">
              {t('end')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="respondentCount">
              {t('respondents')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell className="whitespace-nowrap">{item.studyYear}</TableCell>
              <TableCell>{formatDate(item.startsOn)}</TableCell>
              <TableCell>{formatDate(item.endsOn)}</TableCell>
              <TableCell>{item.respondentCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={items.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={items.length} />
      </Show>
    </>
  );
};
