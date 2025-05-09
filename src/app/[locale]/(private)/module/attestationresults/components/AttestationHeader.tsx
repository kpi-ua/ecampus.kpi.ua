import { TableHead } from '@/components/ui/table';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { HeaderLabel } from '@/app/[locale]/(private)/module/attestationresults/components/HeaderLabel';

interface Props {
  semesterNumber: number;
  attestationNumber: number;
}

export async function AttestationHeader({ semesterNumber, attestationNumber }: Props) {
  const t = await getTranslations('private.attestation-results');

  return (
    <TableHead className="w-[130px] text-center">
      <div className="flex h-full flex-col items-center justify-center">
        <HeaderLabel label={t('column.semester', { semesterNumber })} />
        <HeaderLabel label={t('column.attestation', { attestationNumber })} secondary />
      </div>
    </TableHead>
  );
}
