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

const MAX_SCORE = 100;

interface Props {
  disciplines: Discipline[];
}

export function DisciplinesTable({ disciplines }: Props) {
  const tTable = useTranslations('private.study-sheet.table');

  const { sortedRows, sortHandlers } = useTableSort<Discipline>(disciplines, (row, header) => row[header], ['score']);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{tTable('subject')}</TableHead>
          <TableHead sortHandlers={sortHandlers} sortHeader="score" className="cursor-pointer text-center">
            {tTable('score')}
          </TableHead>
          <TableHead>{tTable('lecturer')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="min-w-[200px] max-w-[336px]">
              <Link className="text-sm font-medium text-basic-black underline" href={`/module/studysheet/${d.id}`}>
                {d.name}
              </Link>
            </TableCell>
            <TableCell className="max-w-[158px]">
              <Badge className="font-semibold text-basic-blue">
                {round(Number(d.score), 2)}/{MAX_SCORE}
              </Badge>
            </TableCell>
            <TableCell className="flex max-w-[360px] flex-col gap-1">
              {d?.lecturers?.map((lecturer, index) => (
                <LecturerItemCell key={index} photo={lecturer.photo} fullName={lecturer.fullName} />
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
