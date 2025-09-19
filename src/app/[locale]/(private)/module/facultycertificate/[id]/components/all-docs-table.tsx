'use client';

import React from 'react';
import { useTableSort } from '@/hooks/use-table-sort';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { DeanCertificate, getDeanCertificatePDF, updateCertificate } from '@/actions/dean.actions';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Printer, X, Check, EyeBold } from '@/app/images';
import { getCertificatePDF } from '@/actions/certificates.actions';
import { downloadFile } from '@/lib/utils';

export function printPdfBlob(blob: Blob, filename?: string): Promise<void> {
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    // Keep it off-screen but on the page (some browsers require it to be in the DOM)
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = url;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      iframe.remove();
    };

    iframe.onload = () => {
      try {
        // Give the doc a title (nice for print dialogs/history)
        try {
          iframe.contentDocument!.title = filename || 'document.pdf';
        } catch {}
        // Some viewers need a microtask tick to settle before printing
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          // Cleanup shortly after print is triggered
          setTimeout(() => {
            cleanup();
            resolve();
          }, 1000);
        }, 0);
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    iframe.onerror = () => {
      cleanup();
      reject(new Error('Failed to load the PDF into the iframe.'));
    };

    document.body.appendChild(iframe);
  });
}

interface Props {
  certificates: DeanCertificate[];
}

export async function printCertificate(id: number) {
  const { blob, filename } = await getDeanCertificatePDF(id);

  const url = URL.createObjectURL(blob);

  downloadFile(url, filename);
}

export function AllDocsTable({ certificates }: Props) {
  const t = useTranslations('private.facultycertificate');
  const tTable = useTranslations('private.facultycertificate.table');

  const { sortedRows, sortHandlers } = useTableSort(certificates, (row, header) => row[header as keyof typeof row], [
    'id',
    'created',
  ]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tTable('fullname')}</TableHead>
            <TableHead>{tTable('purpose')}</TableHead>
            <TableHead>{tTable('originalRequired')}</TableHead>
            <TableHead>{tTable('created')}</TableHead>
            <TableHead>{tTable('received')}</TableHead>
            <TableHead>{tTable('status')}</TableHead>
            <TableHead>{tTable('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.requestedBy.fullName}</TableCell>
              <TableCell>{row.purpose}</TableCell>
              <TableCell>{row.originalRequired ? 'yes' : 'no'}</TableCell>
              <TableCell>{dayjs(row.created).format('DD.MM.YYYY')}</TableCell>
              <TableCell>{row.received && dayjs(row.received).format('DD.MM.YYYY')}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                <Button variant="secondary" onClick={() => updateCertificate(row.id, 'approved')}>
                  <Check />
                </Button>
                <Button variant="secondary">
                  <X />
                </Button>
                <Button variant="secondary" onClick={() => printCertificate(row.id)}>
                  <Printer />
                </Button>
                <Button variant="secondary">
                  <EyeBold />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
