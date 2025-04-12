'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { InternalMaterials } from '@/types/models/current-control/materials';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/LecturerItemCell';

interface Props {
  internalMaterials: InternalMaterials[];
  t: ReturnType<typeof useTranslations>;
}

export function InternalMaterialsTable({ internalMaterials, t }: Props) {
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
        {internalMaterials.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.date}</TableCell>
            <TableCell>
              <Link href={`https://campus.kpi.ua/student/index.php?mode=mob&show&irid=${row.resourceId}`}>
                {row.name}
              </Link>
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
