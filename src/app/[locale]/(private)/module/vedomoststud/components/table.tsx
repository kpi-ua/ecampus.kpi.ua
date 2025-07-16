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

import CaretUp from '@/app/images/icons/CaretUp.svg';
import CaretDown from '@/app/images/icons/CaretDown.svg';
import { Status } from '@/types/enums/session/status';

const INTL_NAMESPACE = 'private.vedomoststud';
const MAX_SCORE = 100;

type Discipline = {
  date: string;
  name: string;
  mark?: number | string;
  assessmentType: string;
  recordType: string;
  lecturer?: {
    photo?: string;
    fullName: string;
  };
  status: string;
  [key: string]: any;
};

type TermResults = {
  disciplines: Discipline[];
  averageScore: number | string;
};

export default function SessionTable({ termResults }: { termResults: TermResults }) {
  const t = useTranslations(INTL_NAMESPACE);
  const tEnums = useTranslations('global.enums');

  const { sortedRows, handleHeaderClick, getSortDirection } = useTableSort<Discipline>(
    termResults.disciplines,
    (row, header) => row[header],
  );

  function renderSortIcon(header: string) {
    const dir = getSortDirection(header);
    if (!dir) return null;
    return dir === 'asc' ? <CaretUp className="inline-block" /> : <CaretDown className="inline-block" />;
  }

  return (
    <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleHeaderClick('date')} className="cursor-pointer">
              <span className="flex items-center gap-3">
                {t('date')}
                {renderSortIcon('date')}
              </span>
            </TableHead>
            <TableHead className="w-[300px]">{t('subject')}</TableHead>
            <TableHead onClick={() => handleHeaderClick('mark')} className="cursor-pointer text-center">
              <span className="flex items-center gap-3">
                {t('score')}
                {renderSortIcon('mark')}
              </span>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick('assessmentType')} className="cursor-pointer">
              <span className="flex items-center gap-3">
                {t('controlType')}
                {renderSortIcon('assessmentType')}
              </span>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick('recordType')} className="cursor-pointer">
              <span className="flex items-center gap-3">
                {t('sessionType')}
                {renderSortIcon('recordType')}
              </span>
            </TableHead>
            <TableHead>{t('lecturer')}</TableHead>
            <TableHead>{t('status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="w-[120px]">{row.date}</TableCell>
              <TableCell className="w-[300px]">{row.name}</TableCell>
              <TableCell className="w-[109px] text-center">
                {row.mark && (
                  <Badge className="font-semibold text-basic-blue">
                    {Number(row.mark)}/{MAX_SCORE}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="w-[140px]">{tEnums(`assessment-type.${dash(row.assessmentType)}`)}</TableCell>
              <TableCell className="w-[140px]">{tEnums(`record-type.${dash(row.recordType)}`)}</TableCell>
              <TableCell className="max-w-[158px]">
                {row.lecturer && <LecturerItemCell photo={row.lecturer.photo ?? ''} fullName={row.lecturer.fullName} />}
              </TableCell>
              <TableCell className="w-[140px]">
                <TermStatusBadge
                  className="flex justify-center border text-center font-semibold"
                  status={row.status as Status}
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
