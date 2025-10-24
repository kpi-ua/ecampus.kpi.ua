'use client';

import React, { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Check, EyeBold, PencilRegular, Printer, X } from '@/app/images';
import { Badge } from '@/components/ui/badge';
import { printCertificate } from '@/app/[locale]/(private)/module/facultycertificate/utils/print-certificate';
import Link from 'next/link';
import { buttonDisableController } from '@/app/[locale]/(private)/module/facultycertificate/utils/button-state-controller';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { RejectDialog } from '@/app/[locale]/(private)/module/facultycertificate/components/reject-dialog';
import { CertificateStatusBadge } from '@/app/[locale]/(private)/module/certificates/components/certificate-status-badge';
import { Certificate } from '@/types/models/certificate/certificate';
import { usePagination } from '@/hooks/use-pagination';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Show } from '@/components/utils/show';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';
import { useTableSort } from '@/hooks/use-table-sort';
import { signCertificate, updateCertificate, UpdateCertificateBody } from '@/actions/certificates.actions';
import { CertificateStatus } from '@/types/models/certificate/status';
import { useToast } from '@/hooks/use-toast';

interface Props {
  certificates: Certificate[];
  totalCount?: number;
}

export const AllDocsTable = memo(function DocsTable({ certificates, totalCount }: Props) {
  const tTable = useTranslations('private.facultycertificate.table');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();

  const handleUpdateCertificate = async (id: number, body: UpdateCertificateBody) => {
    try {
      await updateCertificate(id, body);
    } catch (error) {
      errorToast();
    }
  };

  const handlePrintClick = async (id: number) => {
    try {
      await printCertificate(id);
    } catch (error) {
      errorToast();
    }
  };

  const handleSignClick = async (id: number) => {
    try {
      await signCertificate(id);
      toast({
        title: 'Certificate signed successfully',
        description: 'The certificate has been signed successfully',
      });
    } catch (error) {
      errorToast();
    }
  };

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
            <TableHead>{tTable('purpose')}</TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="originalRequired">
              {tTable('originalRequired')}
            </TableHead>
            <TableHead>{tTable('updatedAt')}</TableHead>
            <TableHead>{tTable('status')}</TableHead>
            <TableHead>{tTable('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row, index) => {
            const { shouldDisableRejectButton, shouldDisablePrintButton, shouldDisableApproveButton } =
              buttonDisableController(row);
            return (
              <TableRow key={index}>
                <TableCell>{row.documentNumber}</TableCell>
                <TableCell>{dayjs(row.created).format('DD.MM.YYYY')}</TableCell>
                <TableCell>{row.requestedBy.fullName}</TableCell>
                <TableCell>{row.purpose}</TableCell>
                <TableCell>{row.originalRequired && <Badge variant="purple">{tTable('withstamp')}</Badge>}</TableCell>
                <TableCell>{row.received && dayjs(row.received).format('DD.MM.YYYY')}</TableCell>
                <TableCell>
                  <CertificateStatusBadge certificate={row} />
                </TableCell>
                <TableCell className="flex gap-2">
                  <div>
                    <Button variant="secondary" size="small" disabled={!row.originalRequired || row.status !== CertificateStatus.Processed} onClick={() => handleSignClick(row.id)}>
                      <PencilRegular />
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleUpdateCertificate(row.id, { approve: true, reason: '' })}
                      disabled={shouldDisableApproveButton}
                    >
                      <Check />
                    </Button>
                  </div>

                  <RejectDialog
                    certificate={row}
                    handleUpdateCertificate={handleUpdateCertificate}
                    shouldDisable={shouldDisableRejectButton}
                    triggerButton={
                      <div>
                        <Button variant="secondary" size="small" disabled={shouldDisableRejectButton}>
                          <X />
                        </Button>
                      </div>
                    }
                  />
                  <div>
                    <Button
                      variant="secondary"
                      size="small"
                      disabled={shouldDisablePrintButton}
                      onClick={() => handlePrintClick(row.id)}
                    >
                      <Printer />
                    </Button>
                  </div>
                  <Link href={`/module/facultycertificate/${row.id}`}>
                    <Button size="small" variant="secondary">
                      <EyeBold />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Show when={!!totalCount}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={totalCount || 1} />
      </Show>
    </>
  );
});
