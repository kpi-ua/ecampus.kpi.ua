import { getTranslations } from 'next-intl/server';

import { Paragraph } from '@/components/typography';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/common';
import { createPagesRange } from '@/lib/pagination.utils';
import { formatDate } from '@/lib/utils';
import { SurveyParticipation } from '@/types/models/statistics';

interface Props {
  items: SurveyParticipation[];
  page: number;
  totalCount: number;
}

export const SurveyParticipationTable = async ({ items, page, totalCount }: Props) => {
  const t = await getTranslations('private.yiystat.surveys');

  if (!items.length) {
    return <Paragraph className="my-0 py-12 text-center text-sm text-neutral-600">{t('empty')}</Paragraph>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('id')}</TableHead>
            <TableHead>{t('year')}</TableHead>
            <TableHead>{t('start')}</TableHead>
            <TableHead>{t('end')}</TableHead>
            <TableHead>{t('respondents')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
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
      {totalCount > PAGE_SIZE_DEFAULT && (
        <Pagination>
          <PaginationContent>
            {createPagesRange({
              currentPage: page,
              pagesCount: Math.ceil(totalCount / PAGE_SIZE_DEFAULT),
              visibleRange: 3,
            }).map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink href={`?page=${item}`} isActive={item === page}>
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};
