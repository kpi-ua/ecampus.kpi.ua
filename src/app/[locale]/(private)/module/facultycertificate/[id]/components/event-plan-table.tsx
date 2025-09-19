'use client';

import React from 'react';
import { useTableSort } from '@/hooks/use-table-sort';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { EventsPlan } from '@/types/models/current-control/events-plan';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';

interface Props {
  eventsPlan: EventsPlan[];
}

export function EventPlanTable({ eventsPlan }: Props) {
  const t = useTranslations('private.study-sheet.table');

  const { sortedRows, sortHandlers } = useTableSort<EventsPlan>(eventsPlan, (row, header) => row[header], ['date']);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead sortHandlers={sortHandlers} sortHeader="date">
            {t('date')}
          </TableHead>
          <TableHead>{t('control-type')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
          <TableHead>{t('note')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.controlType}</TableCell>
            <TableCell className="max-w-[360px]">
              <LecturerItemCell photo={row.lecturer.photo} fullName={row.lecturer.fullName} />
            </TableCell>
            <TableCell>{row.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
