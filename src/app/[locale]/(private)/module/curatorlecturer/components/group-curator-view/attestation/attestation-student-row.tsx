'use client';

import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';

import { CuratorStudentAttestation } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { TableExpandButton } from '@/components/ui/table-expand-button';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';

import { AttestationResultCells } from './attestation-result-cells';

interface Props {
  showRepeated: boolean;
  student: CuratorStudentAttestation;
}

export const AttestationStudentRow = ({ student, showRepeated }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.results');
  const [expanded, setExpanded] = useState(false);

  return (
    <Fragment>
      <TableRow>
        <TableCell className="font-semibold">{student.fullName}</TableCell>
        <Show when={showRepeated}>
          <TableCell>
            <Show when={student.notAttestedTwiceCount > 0} fallback={EMPTY_VALUE}>
              <Badge variant="red">{t('repeated-count', { count: student.notAttestedTwiceCount })}</Badge>
            </Show>
          </TableCell>
        </Show>
        <AttestationResultCells totals={student} />
        <TableCell className="w-12 text-right">
          <Show when={student.disciplines.length > 0}>
            <TableExpandButton expanded={expanded} onToggle={() => setExpanded((current) => !current)} />
          </Show>
        </TableCell>
      </TableRow>
      <Show when={expanded}>
        {student.disciplines.map((discipline) => (
          <TableRow
            key={`${discipline.disciplineId}-${discipline.employeeId}`}
            className="bg-neutral-50 hover:bg-neutral-50 [&>td]:py-2 [&>td]:text-sm"
          >
            <TableCell className="pl-6">
              {discipline.lecturerName} — {discipline.name}
            </TableCell>
            <Show when={showRepeated}>
              <TableCell>
                <Show when={discipline.notAttestedTwice} fallback={EMPTY_VALUE}>
                  <Badge variant="red">{t('repeated-result')}</Badge>
                </Show>
              </TableCell>
            </Show>
            <AttestationResultCells totals={discipline} />
            <TableCell />
          </TableRow>
        ))}
      </Show>
    </Fragment>
  );
};
