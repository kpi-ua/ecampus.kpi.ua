'use client';

import React from 'react';

import { useTableSort } from '@/hooks/use-table-sort';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Paragraph } from '@/components/typography/paragraph';
import { Journal } from '@/types/models/current-control/journal';
import { useTranslations } from 'next-intl';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { SortIcon } from '@/components/ui/sort-icon';

interface Props {
  journal: Journal;
}

export function JournalTable({ journal }: Props) {
  const t = useTranslations('private.study-sheet');
  const tTable = useTranslations('private.study-sheet.table');

  const { sortedRows, handleHeaderClick, getSortDirection } = useTableSort(
    journal.disciplines as unknown as Record<string, unknown>[],
    (row, header) => {
      if (header === 'score') return Number(row.score);
      return row[header as keyof typeof row];
    },
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleHeaderClick('date')} className="cursor-pointer">
              <span className="flex items-center gap-3">
                {tTable('date')}
                {SortIcon(getSortDirection('date'))}
              </span>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick('score')} className="cursor-pointer text-center">
              <span className="flex items-center gap-3">
                {tTable('score')}
                {SortIcon(getSortDirection('score'))}
              </span>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick('controlType')} className="cursor-pointer">
              <span className="flex items-center gap-3">
                {tTable('control-type')}
                {SortIcon(getSortDirection('controlType'))}
              </span>
            </TableHead>
            <TableHead>{tTable('lecturer')}</TableHead>
            <TableHead>{tTable('note')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="w-[116px] text-sm font-medium">{String(row.date ?? '')}</TableCell>
              <TableCell className="w-[109px] text-center">
                {(row.presence !== undefined || row.score !== undefined) && (
                  <Badge className="font-semibold text-basic-blue">
                    {row.presence !== undefined && row.presence !== null
                      ? String(row.presence)
                      : row.score !== undefined && row.score !== null
                        ? String(row.score)
                        : ''}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="w-[240px] text-sm font-medium">{String(row.controlType ?? '')}</TableCell>
              <TableCell className="max-w-[360px]">
                {'lecturer' in row && typeof row.lecturer === 'object' && row.lecturer !== null ? (
                  <LecturerItemCell
                    photo={(row.lecturer as { photo?: string }).photo ?? ''}
                    fullName={(row.lecturer as { fullName?: string }).fullName ?? ''}
                  />
                ) : null}
              </TableCell>
              <TableCell className="text-sm font-medium">{String(row.note ?? '')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-2 flex h-9 items-center gap-2 pl-4">
        <Paragraph className="text-base font-normal">{t('total-score')}</Paragraph>
        <Badge className="bg-basic-blue font-semibold text-basic-white">{journal.totalScore}</Badge>
      </div>
    </>
  );
}
