import { getTranslations } from 'next-intl/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import React from 'react';
import { Heading1 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card } from '@/components/ui/card';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { getAttestationResults } from '@/actions/attestation.actions';
import { AttestationBadge } from '@/app/[locale]/(private)/module/attestationresults/components/AttestationBadge';
import { LocaleProps } from '@/types/locale-props';
import { AttestationHeader } from '@/app/[locale]/(private)/module/attestationresults/components/AttestationHeader';
import { Attestation } from '@/types/models/attestation-results/attestation-result';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'private.attestation-results' });

  return {
    title: t('title'),
  };
}

const SEMESTERS = [1, 2];
const ATTESTATION_NUMBERS = [1, 2];

export default async function AttestationResultsPage() {
  const results = await getAttestationResults();

  const t = await getTranslations('private.attestation-results');

  const getAttestationResult = (attestations: Attestation[], semester: number, number: number) =>
    attestations.find((att) => att.semester === semester && att.number === number)?.result;

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
                {SEMESTERS.map((semester) =>
                  ATTESTATION_NUMBERS.map((number) => (
                    <AttestationHeader
                      key={`${semester}-${number}`}
                      attestationNumber={number}
                      semesterNumber={semester}
                    />
                  )),
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="min-w-[200px] max-w-[336px]">
                    {result.id ? (
                      <Link
                        className="text-sm font-medium text-basic-black underline"
                        href={`/module/studysheet/${result.id}`}
                      >
                        {result.name}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-basic-black">{result.name}</span>
                    )}
                  </TableCell>

                  <TableCell className="max-w-[360px]">
                    <LecturerItemCell photo={result.lecturer.photo} fullName={result.lecturer.fullName} />
                  </TableCell>
                  {SEMESTERS.map((semester) =>
                    ATTESTATION_NUMBERS.map((number) => {
                      const currentResult = getAttestationResult(result?.attestations, semester, number);
                      return (
                        <TableCell key={`${semester}-${number}`}>
                          {currentResult && <AttestationBadge result={currentResult} />}
                        </TableCell>
                      );
                    }),
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </SubLayout>
  );
}
