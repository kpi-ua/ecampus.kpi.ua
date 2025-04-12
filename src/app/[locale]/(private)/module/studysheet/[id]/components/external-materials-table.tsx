'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { ExternalMaterials } from '@/types/models/current-control/materials';
import { useTranslations } from 'next-intl';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/LecturerItemCell';

interface Props {
  externalMaterials: ExternalMaterials[];
  t: ReturnType<typeof useTranslations>;
}

export function ExternalMaterialsTable({ externalMaterials, t }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('date')}</TableHead>
          <TableHead>{t('link')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {externalMaterials.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.date}</TableCell>
            <TableCell>
              <Link href={row.url}>{row.name}</Link>
            </TableCell>
            <TableCell className="max-w-[360px]">
              <LecturerItemCell photo={row.lecturer.photo} fullName={row.lecturer.fullName} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
