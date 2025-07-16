'use client';

import React from 'react';

import { useTableSort } from '@/hooks/use-table-sort';

import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { useTranslations } from 'next-intl';
import { Discipline } from '@/types/models/current-control/sheet';
import { round } from '@/lib/utils';

import CaretUp from '@/app/images/icons/CaretUp.svg';
import CaretDown from '@/app/images/icons/CaretDown.svg';

const MAX_SCORE = 100;

interface Props {
  disciplines: Discipline[];
}

export function DisciplinesTable({ disciplines }: Props) {
  const tTable = useTranslations('private.study-sheet.table');

  const { sortedRows, handleHeaderClick, getSortDirection } = useTableSort<Discipline>(
    disciplines,
    (row, header: string) => {
      if (header === 'score') return Number(row.score);
      return row[header as keyof Discipline];
    },
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
          <TableHead>{tTable('subject')}</TableHead>
          <TableHead onClick={() => handleHeaderClick('score')} className="cursor-pointer text-center">
            <span className="flex items-center gap-3">
              {tTable('score')}
              {renderSortIcon('score')}
            </span>
          </TableHead>
          <TableHead>{tTable('lecturer')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.map((discipline) => (
          <TableRow key={discipline.id}>
            <TableCell className="min-w-[200px] max-w-[336px]">
              <Link
                className="text-sm font-medium text-basic-black underline"
                href={`/module/studysheet/${discipline.id}`}
              >
                {discipline.name}
              </Link>
            </TableCell>
            <TableCell className="max-w-[158px]">
              <Badge className="font-semibold text-basic-blue">
                {round(Number(discipline.score), 2)}/{MAX_SCORE}
              </Badge>
            </TableCell>
            <TableCell className="flex max-w-[360px] flex-col gap-1">
              {discipline?.lecturers?.map((lecturer, index) => (
                <LecturerItemCell key={index} photo={lecturer.photo} fullName={lecturer.fullName} />
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
