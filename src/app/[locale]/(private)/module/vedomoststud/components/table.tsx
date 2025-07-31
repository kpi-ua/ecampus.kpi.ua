'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { dash } from 'radash';

import { useTableSort } from '@/hooks/use-table-sort';

import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TermStatusBadge } from '@/app/[locale]/(private)/module/vedomoststud/components/term-status-badge';
import { Paragraph } from '@/components/typography';

import { Status } from '@/types/enums/session/status';
import { TermDiscipline } from '@/types/models/term';

const MAX_SCORE = 100;

type TermResults = {
  disciplines: TermDiscipline[];
  averageScore: number | string;
};

export default function SessionTable({ termResults }: { termResults: TermResults }) {
  const t = useTranslations('private.vedomoststud');
  const tEnums = useTranslations('global.enums');

  const { sortedRows, sortHandlers } = useTableSort(
    termResults.disciplines,
    (row, header) => row[header as keyof typeof row],
    ['date', 'mark', 'assessmentType', 'recordType'],
  );

  return (
    <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="date">
              {t('date')}
            </TableHead>
            <TableHead className="w-[300px]">{t('subject')}</TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="mark" className="text-center">
              {t('score')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="assessmentType">
              {t('controlType')}
            </TableHead>
            <TableHead sortHandlers={sortHandlers} sortHeader="recordType">
              {t('sessionType')}
            </TableHead>
            <TableHead>{t('lecturer')}</TableHead>
            <TableHead>{t('status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((discipline, index) => (
            <TableRow key={index}>
              <TableCell className="w-[120px]">{discipline.date}</TableCell>
              <TableCell className="w-[300px]">{discipline.name}</TableCell>
              <TableCell className="w-[109px] text-center">
                {discipline.mark !== undefined && discipline.mark !== null && (
                  <Badge className="font-semibold text-basic-blue">
                    {Number(discipline.mark)}/{MAX_SCORE}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="w-[140px]">
                {tEnums(`assessment-type.${dash(discipline.assessmentType)}`)}
              </TableCell>
              <TableCell className="w-[140px]">{tEnums(`record-type.${dash(discipline.recordType)}`)}</TableCell>
              <TableCell className="max-w-[158px]">
                {discipline.lecturer && (
                  <LecturerItemCell photo={discipline.lecturer.photo ?? ''} fullName={discipline.lecturer.fullName} />
                )}
              </TableCell>
              <TableCell className="w-[140px]">
                <TermStatusBadge
                  className="flex justify-center border text-center font-semibold"
                  status={discipline.status as Status}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="my-2 flex items-center gap-2 whitespace-nowrap pl-4">
        <Paragraph className="text-base font-normal">{t('average-score')}</Paragraph>
        <Badge className="bg-basic-blue font-semibold text-basic-white">{termResults.averageScore}</Badge>
      </div>
    </Card>
  );
}
