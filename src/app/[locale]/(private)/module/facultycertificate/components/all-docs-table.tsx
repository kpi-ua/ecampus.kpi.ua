'use client';

import React, { memo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { updateCertificate, UpdateCertificateBody } from '@/actions/dean.actions';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Check, EyeBold, MagnifyingGlassRegular, Printer, X } from '@/app/images';
import { Badge } from '@/components/ui/badge';
import { printCertificate } from '@/app/[locale]/(private)/module/facultycertificate/utils/print-certificate';
import Link from 'next/link';
import { buttonDisableController } from '@/app/[locale]/(private)/module/facultycertificate/utils/button-state-controller';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { RejectDialog } from '@/app/[locale]/(private)/module/facultycertificate/components/reject-dialog';
import { CertificateStatusBadge } from '@/app/[locale]/(private)/module/certificates/components/certificate-status-badge';
import { Certificate } from '@/types/models/certificate/certificate';
import { Input } from '@/components/ui/input'; // Make sure you have an Input component
import { usePagination } from '@/hooks/use-pagination';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Show } from '@/components/utils/show';

const PAGE_SIZE = 10;

interface Props {
  certificates: Certificate[];
}

export const AllDocsTable = memo(function DocsTable({ certificates }: Props) {
  const tTable = useTranslations('private.facultycertificate.table');
  const { errorToast } = useServerErrorToast();

  const [search, setSearch] = useState('');

  const handleUpdateCertificate = async (id: number, body: UpdateCertificateBody) => {
    try {
      await updateCertificate(id, body);
    } catch (error) {
      errorToast();
    }
  };

  const filteredCertificates = certificates.filter((row) => {
    const searchLower = search.toLowerCase();
    return (
      row.requestedBy.fullName.toLowerCase().includes(searchLower) ||
      row.purpose.toLowerCase().includes(searchLower)
    );
  });
  const { paginatedItems: paginatedCertificates, page } = usePagination(PAGE_SIZE, filteredCertificates);

  return (
    <>
      <div className="mb-4 flex">
        <Input
          icon={<MagnifyingGlassRegular />}
          placeholder="Пошук за імʼям студента, призначенням..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tTable('documentNumber')}</TableHead>
            <TableHead>{tTable('fullname')}</TableHead>
            <TableHead>{tTable('purpose')}</TableHead>
            <TableHead>{tTable('originalRequired')}</TableHead>
            <TableHead>{tTable('created')}</TableHead>
            <TableHead>{tTable('updatedAt')}</TableHead>
            <TableHead>{tTable('status')}</TableHead>
            <TableHead>{tTable('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCertificates.map((row, index) => {
            const { shouldDisableRejectButton, shouldDisablePrintButton, shouldDisableApproveButton } =
              buttonDisableController(row);
            return (
              <TableRow key={index}>
                <TableCell>{row.documentNumber}</TableCell>
                <TableCell>{row.requestedBy.fullName}</TableCell>
                <TableCell>{row.purpose}</TableCell>
                <TableCell>{row.originalRequired && <Badge variant="purple">{tTable('withstamp')}</Badge>}</TableCell>
                <TableCell>{dayjs(row.created).format('DD.MM.YYYY')}</TableCell>
                <TableCell>{row.received && dayjs(row.received).format('DD.MM.YYYY')}</TableCell>
                <TableCell>
                  <CertificateStatusBadge certificate={row} />
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateCertificate(row.id, { approve: true, reason: '' })}
                    disabled={shouldDisableApproveButton}
                  >
                    <Check />
                  </Button>
                  <RejectDialog
                    certificate={row}
                    handleUpdateCertificate={handleUpdateCertificate}
                    triggerButton={
                      <Button variant="secondary" disabled={shouldDisableRejectButton}>
                        <X />
                      </Button>
                    }
                  />
                  <Button
                    variant="secondary"
                    disabled={shouldDisablePrintButton}
                    onClick={() => printCertificate(row.id)}
                  >
                    <Printer />
                  </Button>
                  <Link href={`/module/facultycertificate/${row.id}`}>
                    <Button variant="secondary">
                      <EyeBold />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Show when={filteredCertificates.length > PAGE_SIZE}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE} totalCount={certificates.length} />
      </Show>
    </>
  );
});
