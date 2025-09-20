'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { InternalMaterials } from '@/types/models/current-control/materials';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { useTableSort } from '@/hooks/use-table-sort';
import { DeanCertificate } from '@/actions/dean.actions';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Check, EyeBold, Printer, X } from '@/app/images';

interface Props {
  certificates: DeanCertificate[];
}

export function ApprovedDocsTable({ certificates }: Props) {
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
                <Button variant="secondary">
                  <Check />
                </Button>
                <Button variant="secondary">
                  <X />
                </Button>
                <Button variant="secondary">
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
