'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Paragraph } from '@/components/typography/paragraph';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Journal } from '@/types/models/current-control/journal';
import { useTranslations } from 'next-intl';

interface JournalTableProps {
  journal: Journal[];
  totalScore: number;
  tTable: ReturnType<typeof useTranslations>;
  t: ReturnType<typeof useTranslations>;
}

export const JournalTable: React.FC<JournalTableProps> = ({ journal, totalScore, tTable, t }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tTable('date')}</TableHead>
            <TableHead className="text-center">{tTable('score')}</TableHead>
            <TableHead>{tTable('control-type')}</TableHead>
            <TableHead>{tTable('lecturer')}</TableHead>
            <TableHead>{tTable('note')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {journal.map((row) => (
            <TableRow key={row.date}>
              <TableCell className="w-[116px] text-sm font-medium">{row.date}</TableCell>
              <TableCell className="w-[109px] text-center">
                {(row.presence || row.score) && (
                  <Badge className="font-semibold text-basic-blue">{row.presence ? row.presence : row.score}</Badge>
                )}
              </TableCell>
              <TableCell className="w-[240px] text-sm font-medium">{row.controlType}</TableCell>
              <TableCell className="max-w-[360px]">
                <div className="flex items-center gap-3">
                  <ProfilePicture size="xs" src={row.lecturer.photo} />
                  <span className="text-sm font-semibold text-basic-black">{row.lecturer.fullName}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-medium">{row.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-2 flex h-9 items-center gap-2">
        <Paragraph className="text-base font-normal">{t('total-score')}</Paragraph>
        <Badge className="bg-basic-blue font-semibold text-basic-white">{totalScore}</Badge>
      </div>
    </>
  );
};
