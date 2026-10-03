'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

import { CertificateStatusBadge } from '@/app/[locale]/(private)/module/certificates/components/certificate-status-badge';
import { Certificate } from '@/types/models/certificate/certificate';
import { usePagination } from '@/hooks/use-pagination';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Show } from '@/components/utils/show';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';
import { useTableSort } from '@/hooks/use-table-sort';

interface Props {
  certificates: Certificate[];
  totalCount?: number;
}

export const AllDocsTable = memo(function DocsTable({ certificates, totalCount }: Props) {
  const tTable = useTranslations('private.facultycertificate.table');

  const { sortedRows, sortHandlers } = useTableSort(certificates, (row, header) => row[header as keyof typeof row], [
    'created',
    'originalRequired',
  ]);

  const { page } = usePagination(PAGE_SIZE_DEFAULT, certificates);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tTable('documentNumber')}</TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="created">
              {tTable('created')}
            </TableHead>
            <TableHead>{tTable('fullname')}</TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="originalRequired">
              {tTable('deliveryOption')}
            </TableHead>
            <TableHead>{tTable('status')}</TableHead>
            <TableHead>{tTable('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.documentNumber}</TableCell>
              <TableCell>{dayjs(row.created).format('DD.MM.YYYY')}</TableCell>
              <TableCell>{row.requestedBy.fullName}</TableCell>
              <TableCell>
                {row.originalRequired ? (
                  <Badge variant="purple">{tTable('deliveryPaper')}</Badge>
                ) : (
                  <Badge variant="blue">{tTable('deliveryElectronic')}</Badge>
                )}
              </TableCell>
              <TableCell>
                <CertificateStatusBadge certificate={row} />
              </TableCell>
              <TableCell>
                <Link href={`/module/facultycertificate/${row.id}`}>
                  <Button size="small" variant="secondary">
                    {tTable('goTo')}
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={!!totalCount}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={totalCount || 1} />
      </Show>
    </>
  );
});
