'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { Link } from '@/i18n/routing';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';

import { ZamdekanAgreement } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  agreements: ZamdekanAgreement[];
}

export const ZamdekanAgreementsTable = ({ agreements }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { sortedRows, sortHandlers } = useTableSort(agreements, undefined, [
    'fullName',
    'status',
    'group',
    'department',
    'hasAgreement',
    'acceptedAt',
  ]);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (agreements.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="fullName">
              {t('columns.fullName')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="status">
              {t('columns.status')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="group">
              {t('columns.group')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="department">
              {t('columns.department')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="hasAgreement">
              {t('columns.hasAgreement')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="acceptedAt">
              {t('columns.acceptedAt')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((row) => (
            <TableRow key={row.studentId}>
              <TableCell className="whitespace-pre-wrap">
                <Link
                  href={getZamdekanReportPath({ view: 'results', studentId: row.studentId, groupId: row.groupId })}
                  className="underline"
                >
                  {row.fullName}
                </Link>
              </TableCell>
              <TableCell className="whitespace-pre-wrap">{row.status}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.department}</TableCell>
              <TableCell className="whitespace-pre-wrap">{t(row.hasAgreement ? 'values.yes' : 'values.no')}</TableCell>
              <TableCell className="whitespace-pre-wrap">
                {row.acceptedAt ? dayjs(row.acceptedAt).format('DD.MM.YYYY') : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={agreements.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={agreements.length} />
      </Show>
    </div>
  );
};
