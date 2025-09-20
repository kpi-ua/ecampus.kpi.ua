'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { getDeanCertificatePDF, updateCertificate } from '@/actions/dean.actions';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Check, EyeBold, Printer, X } from '@/app/images';
import { DeanCertificate } from '@/types/models/dean/dean-certificate';
import { DeanCertificateStatus } from '@/types/enums/dean/certificate-status';

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
  await printPdfBlob(blob, filename);

  // const url = URL.createObjectURL(blob);

  // downloadFile(url, filename);
}

export function AllDocsTable({ certificates }: Props) {
  const tTable = useTranslations('private.facultycertificate.table');

  const handleUpdateCertificate = async (id: number, status: DeanCertificateStatus, reason?: string) => {
    try {
      await updateCertificate(id, status, reason);
    } catch (error) {
      console.error('Error updating certificate:', error);
    }
  };

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
          {certificates.map((row, index) => {
            const isProcessed = row.status === DeanCertificateStatus.Processed;

            return (
              <TableRow key={index}>
                <TableCell>{row.requestedBy.fullName}</TableCell>
                <TableCell>{row.purpose}</TableCell>
                <TableCell>{row.originalRequired ? 'yes' : 'no'}</TableCell>
                <TableCell>{dayjs(row.created).format('DD.MM.YYYY')}</TableCell>
                <TableCell>{row.received && dayjs(row.received).format('DD.MM.YYYY')}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateCertificate(row.id, DeanCertificateStatus.Approved, '')}
                  >
                    <Check />
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateCertificate(row.id, DeanCertificateStatus.Rejected)}
                  >
                    <X />
                  </Button>
                  <Button variant="secondary" disabled={!isProcessed} onClick={()=> printCertificate(row.id)}>
                    <Printer />
                  </Button>
                  <Button variant="secondary">
                    <EyeBold />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
