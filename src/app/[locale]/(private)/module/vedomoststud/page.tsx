import { getTranslations } from 'next-intl/server';
import React from 'react';
import { dash } from 'radash';

import { getTerm } from '@/actions/term.actions';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LocaleProps } from '@/types/locale-props';
import { TermStatusBadge } from '@/app/[locale]/(private)/module/vedomoststud/components/term-status-badge';
import { Paragraph } from '@/components/typography';

const INTL_NAMESPACE = 'private.vedomoststud';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

const MAX_SCORE = 100;

export default async function SessionPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const tEnums = await getTranslations('global.enums');

  const termResults = await getTerm();

  return (
    <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('date')}</TableHead>
            <TableHead>{t('subject')}</TableHead>
            <TableHead className="text-center">{t('score')}</TableHead>
            <TableHead>{t('controlType')}</TableHead>
            <TableHead>{t('sessionType')}</TableHead>
            <TableHead>{t('lecturer')}</TableHead>
            <TableHead>{t('status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {termResults.disciplines.map((row, index) => (
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
                {row.lecturer && <LecturerItemCell photo={row.lecturer.photo} fullName={row.lecturer.fullName} />}
              </TableCell>
              <TableCell className="w-[140px]">
                <TermStatusBadge className="flex justify-center border text-center font-semibold" status={row.status} />
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
