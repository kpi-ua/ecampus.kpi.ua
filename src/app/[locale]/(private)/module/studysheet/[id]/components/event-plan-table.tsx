'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { useTranslations } from 'next-intl';
import { EventsPlan } from '@/types/models/current-control/events-plan';

interface EventPlanTableProps {
  eventsPlan: EventsPlan[];
  t: ReturnType<typeof useTranslations>;
}

export const EventPlanTable: React.FC<EventPlanTableProps> = ({ eventsPlan, t }) => {
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
              <div className="flex items-center gap-3">
                <ProfilePicture size="xs" src={row.lecturer.photo} />
                <span className="text-sm font-semibold text-basic-black">{row.lecturer.fullName}</span>
              </div>
            </TableCell>
            <TableCell>{row.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
