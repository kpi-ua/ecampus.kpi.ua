'use client';

import { Card } from '@/components/ui/card';
import { Heading6, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dash } from 'radash';
import dayjs from 'dayjs';
import { CertificateStatusBadge } from '@/app/[locale]/(private)/module/certificates/components/certificate-status-badge';
import { CertificateStatus } from '@/types/models/certificate/status';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utils/show';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { useTranslations } from 'next-intl';
import { getCertificatePDF } from '@/actions/certificates.actions';
import { usePagination } from '@/hooks/use-pagination';
import { Certificate } from '@/types/models/certificate/certificate';
import saveAs from 'file-saver';
import { PAGE_SIZE_SMALL } from '@/lib/constants/page-size';
import { base64ToBlob } from '@/lib/utils';

interface Props {
  certificates: Certificate[];
}

export function HistoryTable({ certificates }: Props) {
  const tTable = useTranslations('public.verification.result.table');
  const tEnums = useTranslations('global.enums.certificate-type');

  const { paginatedItems: paginatedCertificates, page } = usePagination(PAGE_SIZE_SMALL, certificates);

  const handleDownload = async (id: number) => {
    const { filename, base64 } = await getCertificatePDF(id);
    const blob = base64ToBlob(base64, 'application/pdf');
    saveAs(blob, filename);
  };

  return (
    <Card className="rounded-b-6 col-span-full flex w-full min-w-0 flex-1 flex-col gap-4 bg-white p-4 sm:gap-6 sm:p-6 md:p-9 xl:col-span-5">
      <Heading6>{tTable('title')}</Heading6>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tTable('type')}</TableHead>
            <TableHead>{tTable('documentNumber')}</TableHead>
            <TableHead>{tTable('date')}</TableHead>
            <TableHead>{tTable('status')}</TableHead>
            <TableHead>{tTable('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCertificates.map((certificate) => {
            const isElectronic = !certificate.originalRequired;
            const canDownload =
              isElectronic &&
              (certificate.status === CertificateStatus.Processed || certificate.status === CertificateStatus.Signed);
            const isReadyAtDeanOffice = certificate.originalRequired && certificate.status === CertificateStatus.Signed;

            return (
              <TableRow key={certificate.id}>
                <TableCell className="w-[140px]">
                  <Paragraph className="m-0 text-sm font-normal">{tEnums(dash(certificate.type))}</Paragraph>
                </TableCell>
                <TableCell className="w-[140px]">
                  {certificate.documentNumber ? (
                    <Paragraph className="m-0 text-sm font-medium">{certificate.documentNumber}</Paragraph>
                  ) : (
                    <Paragraph className="m-0 text-sm text-neutral-400">—</Paragraph>
                  )}
                </TableCell>
                <TableCell className="w-[100px]">{dayjs(certificate.created).format('DD.MM.YYYY')}</TableCell>
                <TableCell className="w-[100px]">
                  <CertificateStatusBadge certificate={certificate} />
                </TableCell>
                <TableCell className="w-[100px]">
                  {canDownload && (
                    <Button variant="secondary" onClick={() => handleDownload(certificate.id)}>
                      {tTable('download')}
                    </Button>
                  )}
                  {isReadyAtDeanOffice && (
                    <Paragraph className="m-0 text-sm font-normal text-green-600">{tTable('readyAtDeanOffice')}</Paragraph>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Show when={certificates.length > PAGE_SIZE_SMALL}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_SMALL} totalCount={certificates.length} />
      </Show>
    </Card>
  );
}
