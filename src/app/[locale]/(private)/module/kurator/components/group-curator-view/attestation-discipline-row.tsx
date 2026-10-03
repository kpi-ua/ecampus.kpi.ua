'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { CuratorAttestationRow } from '../../types';
import { groupAttestationResults } from '../../utils/group-attestation-results';
import { AttestationResultCells } from './attestation-result-cells';

interface Props {
  showRepeated: boolean;
  discipline: {
    name: string;
    lecturerName: string;
    results: CuratorAttestationRow[];
  };
}

export const AttestationDisciplineRow = ({ discipline, showRepeated }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator.results');
  const [expanded, setExpanded] = useState(false);
  const students = groupAttestationResults(discipline.results, 'student');
  const repeated = students.filter((student) => student.results.some((result) => result.notAttestedTwice)).length;
  return (
    <>
      <TableRow>
        <TableCell className="font-semibold">
          {discipline.name} — {discipline.lecturerName}
        </TableCell>
        <Show when={showRepeated}>
          <TableCell>
            <Show when={repeated > 0} fallback="—">
              <Badge variant="red">{repeated}</Badge>
            </Show>
          </TableCell>
        </Show>
        <AttestationResultCells results={discipline.results} />
        <TableCell className="w-12 text-right">
          <button
            type="button"
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100"
            aria-label={expanded ? t('collapse-students') : t('expand-students')}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
        </TableCell>
      </TableRow>
      <Show when={expanded}>
        {students.map(({ key, results }) => (
          <TableRow key={key} className="bg-neutral-50 hover:bg-neutral-50">
            <TableCell className="pl-6">{results[0].fullName}</TableCell>
            <Show when={showRepeated}>
              <TableCell>
                <Show when={results.some((result) => result.notAttestedTwice)} fallback="—">
                  <Badge variant="red">{t('repeated-result')}</Badge>
                </Show>
              </TableCell>
            </Show>
            <AttestationResultCells results={results} />
            <TableCell />
          </TableRow>
        ))}
      </Show>
    </>
  );
};
