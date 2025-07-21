'use client';

import React from 'react';

import { useTableSort } from '@/hooks/use-table-sort';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { ExternalMaterials } from '@/types/models/current-control/materials';
import { useTranslations } from 'next-intl';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { SortIcon } from '@/components/ui/sort-icon';

interface Props {
  externalMaterials: ExternalMaterials[];
}

export function ExternalMaterialsTable({ externalMaterials }: Props) {
  const t = useTranslations('private.study-sheet.table');

  const { sortedRows, handleHeaderClick, getSortDirection } = useTableSort(
    externalMaterials as unknown as Record<string, unknown>[],
    (row, header) => row[header as keyof ExternalMaterials],
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleHeaderClick('date')} className="cursor-pointer">
            <span className="flex items-center gap-3">
              {t('date')}
              {SortIcon(getSortDirection('date'))}
            </span>
          </TableHead>
          <TableHead>{t('link')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{String(row.date)}</TableCell>
            <TableCell>
              <Link href={String(row.url)}>{String(row.name)}</Link>
            </TableCell>
            <TableCell className="max-w-[360px]">
              <LecturerItemCell
                photo={(row as unknown as ExternalMaterials).lecturer.photo}
                fullName={(row as unknown as ExternalMaterials).lecturer.fullName}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
