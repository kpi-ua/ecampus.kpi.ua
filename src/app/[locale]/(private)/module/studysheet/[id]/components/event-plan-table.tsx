'use client';

import React from 'react';

import { useTableSort } from '@/hooks/use-table-sort';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { EventsPlan } from '@/types/models/current-control/events-plan';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { SortIcon } from '@/components/ui/sort-icon';

interface Props {
  eventsPlan: EventsPlan[];
}

export function EventPlanTable({ eventsPlan }: Props) {
  const t = useTranslations('private.study-sheet.table');

  const { sortedRows, handleHeaderClick, getSortDirection } = useTableSort(
    eventsPlan as unknown as Record<string, unknown>[],
    (row, header) => row[header as keyof EventsPlan],
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
          <TableHead>{t('control-type')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
          <TableHead>{t('note')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{String(row.date)}</TableCell>
            <TableCell>{String(row.controlType)}</TableCell>
            <TableCell className="max-w-[360px]">
              <LecturerItemCell
                photo={(row as unknown as EventsPlan).lecturer.photo}
                fullName={(row as unknown as EventsPlan).lecturer.fullName}
              />
            </TableCell>
            <TableCell>{String(row.note)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
