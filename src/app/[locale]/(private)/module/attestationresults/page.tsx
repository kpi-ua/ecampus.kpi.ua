import { getTranslations } from 'next-intl/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import React from 'react';
import { Card } from '@/components/ui/card';
import { getAttestationResults } from '@/actions/attestation.actions';
import { AttestationBadge } from '@/app/[locale]/(private)/module/attestationresults/components/attestation-badge';
import { LocaleProps } from '@/types/locale-props';
import { AttestationHeader } from '@/app/[locale]/(private)/module/attestationresults/components/attestation-header';
import { Attestation } from '@/types/models/attestation-results/attestation-result';

const INTL_NAMESPACE = 'private.attestation-results';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

const SEMESTERS = [1, 2];
const ATTESTATION_NUMBERS = [1, 2];

export default async function AttestationResultsPage() {
  const results = await getAttestationResults();

  const t = await getTranslations(INTL_NAMESPACE);

  const getAttestationResult = (attestations: Attestation[], semester: number, number: number) => {
    const attestation = attestations.find((att) => att.semester === semester && att.number === number);
    return attestation ? attestation.result : null;
  };

  return (
    <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('subject')}</TableHead>
            <TableHead>{t('lecturer')}</TableHead>
            {SEMESTERS.map((semester) =>
              ATTESTATION_NUMBERS.map((number) => (
                <AttestationHeader key={`${semester}-${number}`} attestationNumber={number} semesterNumber={semester} />
              )),
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell className="max-w-[336px] min-w-[200px]">
                {result.id ? (
                  <Link
                    className="text-basic-black text-sm font-medium underline"
                    href={`/module/studysheet/${result.id}`}
                  >
                    {result.name}
                  </Link>
                ) : (
                  <span className="text-basic-black text-sm font-medium">{result.name}</span>
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
                      {currentResult !== null && <AttestationBadge result={currentResult} />}
                    </TableCell>
                  );
                }),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
