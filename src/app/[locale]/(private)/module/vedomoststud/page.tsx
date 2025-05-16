import { getTranslations } from 'next-intl/server';
import React from 'react';

import { getVedomostStud } from '@/actions/vedomoststud.actions';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading1 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LocaleProps } from '@/types/locale-props';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'private.vedomoststud' });

  return {
    title: t('title'),
  };
}

const MAX_SCORE = 100;

export default async function SessionPage() {
  const t = await getTranslations('private.vedomoststud');

  const sessionResults = await getVedomostStud();

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-9">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionResults.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[200px]">{row.date ?? ''}</TableCell>
                  <TableCell className="w-[300px]">{row.name}</TableCell>

                  <TableCell className="w-[109px] text-center">
                    {row.mark && (
                      <Badge className="font-semibold text-basic-blue">
                        {Number(row.mark)}/{MAX_SCORE}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="w-[140px]">{row.assessmentType}</TableCell>
                  <TableCell className="w-[140px]">{row.recordType}</TableCell>
                  <TableCell className="max-w-[158px]">
                    <LecturerItemCell photo={row.lecturer.photo} fullName={row.lecturer.fullName} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </SubLayout>
  );
}
