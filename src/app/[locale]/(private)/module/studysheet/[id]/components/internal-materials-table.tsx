'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { InternalMaterials } from '@/types/models/current-control/materials';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import CaretUp from '@/app/images/icons/CaretUp.svg';
import CaretDown from '@/app/images/icons/CaretDown.svg';
import { useTableSort } from '@/hooks/use-table-sort';

interface Props {
  internalMaterials: InternalMaterials[];
}

export function InternalMaterialsTable({ internalMaterials }: Props) {
  const t = useTranslations('private.study-sheet.table');

  const { sortedRows, handleHeaderClick, getSortDirection } = useTableSort(
    internalMaterials,
    (row, header) => row[header as keyof InternalMaterials],
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
