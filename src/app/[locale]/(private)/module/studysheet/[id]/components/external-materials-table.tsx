'use client';

import React from 'react';

import { useTableSort } from '@/hooks/use-table-sort';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { ExternalMaterials } from '@/types/models/current-control/materials';
import { useTranslations } from 'next-intl';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';

import CaretUp from '@/app/images/icons/CaretUp.svg';
import CaretDown from '@/app/images/icons/CaretDown.svg';

interface Props {
  externalMaterials: ExternalMaterials[];
}

export function ExternalMaterialsTable({ externalMaterials }: Props) {
  const t = useTranslations('private.study-sheet.table');

  const { sortedRows, handleHeaderClick, getSortDirection } = useTableSort(
    externalMaterials,
    (row, header) => row[header as keyof ExternalMaterials],
  );

  function renderSortIcon(header: string) {
    const dir = getSortDirection(header);
    if (!dir) return null;
    return dir === 'asc' ? <CaretUp className="inline-block" /> : <CaretDown className="inline-block" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleHeaderClick('date')} className="cursor-pointer">
            <span className="flex items-center gap-3">
              {t('date')}
              {renderSortIcon('date')}
            </span>
          </TableHead>
          <TableHead>{t('link')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.map((row, index) => (
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
