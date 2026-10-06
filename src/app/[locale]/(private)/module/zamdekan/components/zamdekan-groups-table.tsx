'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';

import { ZamdekanGroup } from '../types';

interface Props {
  groups: ZamdekanGroup[];
}

export const ZamdekanGroupsTable = ({ groups }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { sortedRows, sortHandlers } = useTableSort(groups, undefined, ['course', 'group', 'curator']);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (groups.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="course">
              {t('columns.course')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="group">
              {t('columns.group')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="curator">
              {t('columns.curator')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((row) => (
            <TableRow key={row.groupId}>
              <TableCell className="whitespace-pre-wrap">{row.course}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.curator}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={groups.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={groups.length} />
      </Show>
    </div>
  );
};
