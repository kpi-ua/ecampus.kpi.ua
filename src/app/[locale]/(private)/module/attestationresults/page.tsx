import { getTranslations } from 'next-intl/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import React from 'react';
import { Heading1 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card } from '@/components/ui/card';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { getAttestationResult } from '@/actions/monitoring.actions';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'private.study-sheet' });

  return {
    title: t('title'),
  };
}

export default async function StudySheetPage() {
  // const attestationResults = await getAttestationResult();
  const t = await getTranslations('private.attestation-results');

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-8">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('subject')}</TableHead>
                <TableHead>{t('lecturer')}</TableHead>
                <TableHead className="text-center">
                  1 семестр <span className="text-neutral-700">Атестація №1</span>
                </TableHead>
                <TableHead className="text-center">
                  1 семестр <span className="text-neutral-700">Атестація №2</span>
                </TableHead>
                <TableHead className="text-center">
                  2 семестр <span className="text-neutral-700">Атестація №1</span>
                </TableHead>
                <TableHead className="text-center">
                  2 семестр <span className="text-neutral-700">Атестація №2</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="max-w-[336px]">
                  <Link className="text-sm font-medium text-basic-black underline" href={`/module/studysheet/${123}`}>
                    Проектування інформаційних систем
                  </Link>
                </TableCell>

                <TableCell className="max-w-[360px]">
                  <LecturerItemCell photo="" fullName="Тимошенко Оксана Сергіївна" />
                </TableCell>

                <TableCell>
                  <Badge className="flex justify-center border border-status-success-300 bg-status-success-100 font-semibold text-status-success-300">
                    А
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className="flex justify-center border border-status-danger-300 bg-status-danger-100 font-semibold text-status-danger-300">
                    Н/А
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className="flex justify-center border border-status-success-300 bg-status-success-100 font-semibold text-status-success-300">
                    атестовано
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className="flex justify-center border border-status-danger-300 bg-status-danger-100 font-semibold text-status-danger-300">
                    не атестовано
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </SubLayout>
  );
}
