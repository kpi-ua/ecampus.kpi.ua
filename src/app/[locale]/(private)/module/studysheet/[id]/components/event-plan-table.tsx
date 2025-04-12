'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { EventsPlan } from '@/types/models/current-control/events-plan';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/LecturerItemCell';

interface Props {
  eventsPlan: EventsPlan[];
  t: ReturnType<typeof useTranslations>;
}

export function EventPlanTable({ eventsPlan, t }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('date')}</TableHead>
          <TableHead>{t('control-type')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
          <TableHead>{t('note')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {eventsPlan.map((row, index) => (
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
