import { getTranslations } from 'next-intl/server';

import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { type StudentAttestation } from '@/types/models/dean-office';

export async function StudentAttestationTable({ attestations }: { attestations: StudentAttestation[] }) {
  const t = await getTranslations('private.dean-office');
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('studyYear')}</TableHead>
          <TableHead>{t('semester')}</TableHead>
          <TableHead>{t('discipline')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
          <TableHead>{t('assessment')}</TableHead>
          <TableHead>{t('result')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Show when={attestations.length > 0} fallback={<TableEmptyRow colSpan={6}>{t('empty')}</TableEmptyRow>}>
          {attestations.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.studyYear ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.semester ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.discipline ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.lecturer ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.assessment ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.result ? t(`attestationStatuses.${row.result}`) : EMPTY_VALUE}</TableCell>
            </TableRow>
          ))}
        </Show>
      </TableBody>
    </Table>
  );
}
