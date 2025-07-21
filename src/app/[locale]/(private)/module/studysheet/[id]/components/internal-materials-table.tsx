'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { InternalMaterials } from '@/types/models/current-control/materials';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { SortIcon } from '@/components/ui/sort-icon';
import { useTableSort } from '@/hooks/use-table-sort';

interface Props {
  internalMaterials: InternalMaterials[];
}

export function InternalMaterialsTable({ internalMaterials }: Props) {
  const t = useTranslations('private.study-sheet.table');

  const { sortedRows, handleHeaderClick, getSortDirection } = useTableSort(
    internalMaterials as unknown as Record<string, unknown>[],
    (row, header) => row[header as keyof InternalMaterials],
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
              <Link href={`https://campus.kpi.ua/student/index.php?mode=mob&show&irid=${row.resourceId}`}>
                {String(row.name)}
              </Link>
            </TableCell>
            <TableCell className="max-w-[360px]">
              <LecturerItemCell
                photo={(row as unknown as InternalMaterials).lecturer.photo}
                fullName={(row as unknown as InternalMaterials).lecturer.fullName}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
