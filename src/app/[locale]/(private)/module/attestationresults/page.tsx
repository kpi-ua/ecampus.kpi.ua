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
import { getAttestationResults } from '@/actions/monitoring.actions';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'private.study-sheet' });

  return {
    title: t('title'),
  };
}

export default async function AttestationResultsPage() {
  const results = await getAttestationResults();
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
                {results.map((result) => {
                  return result.attestations.map((attestation, index) => (
                    <TableHead key={index} className="text-center">
                      {attestation.semester} семестр{' '}
                      <span className="text-neutral-700">Атестація №{attestation.attestationNumber}</span>
                    </TableHead>
                  ));
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="max-w-[336px]">
                    <Link className="text-sm font-medium text-basic-black underline" href={`/module/studysheet/${123}`}>
                      {result.name}
                    </Link>
                  </TableCell>

                  <TableCell className="max-w-[360px]">
                    <LecturerItemCell photo={result.lecturer.photo} fullName={result.lecturer.fullName} />
                  </TableCell>

                  {result.attestations.map((attestation, index) => (
                    <TableCell key={index}>
                      {attestation.attestationResult ? (
                        <Badge className="flex justify-center border border-status-success-300 bg-status-success-100 font-semibold text-status-success-300">
                          А
                        </Badge>
                      ) : (
                        <Badge className="flex justify-center border border-status-danger-300 bg-status-danger-100 font-semibold text-status-danger-300">
                          Н/А
                        </Badge>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </SubLayout>
  );
}
