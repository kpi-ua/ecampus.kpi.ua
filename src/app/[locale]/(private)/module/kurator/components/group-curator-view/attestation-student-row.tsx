'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { CuratorAttestationStudent } from '../../types';
import { AttestationResultCells } from './attestation-result-cells';

interface Props {
  showRepeated: boolean;
  student: CuratorAttestationStudent;
}

const emptyResult = '—';

export const AttestationStudentRow = ({ student, showRepeated }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator.results');
  const [expanded, setExpanded] = useState(false);

  return (
    <Fragment>
      <TableRow>
        <TableCell className="font-semibold">{student.fullName}</TableCell>
        <Show when={showRepeated}>
          <TableCell>
            <Show when={student.notAttestedTwiceCount > 0} fallback={emptyResult}>
              <Badge variant="red">{t('repeated-count', { count: student.notAttestedTwiceCount })}</Badge>
            </Show>
          </TableCell>
        </Show>
        <AttestationResultCells results={student.results} />
        <TableCell className="w-12 text-right">
          {student.disciplines.length > 0 && (
            <button
              type="button"
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100"
              aria-label={expanded ? t('collapse-disciplines') : t('expand-disciplines')}
              aria-expanded={expanded}
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
            </button>
          )}
        </TableCell>
      </TableRow>
      <Show when={expanded}>
        {student.disciplines.map((discipline) => (
          <TableRow
            key={`${discipline.disciplineId}-${discipline.employeeId}`}
            className="bg-neutral-50 hover:bg-neutral-50"
          >
            <TableCell className="pl-6">
              {discipline.lecturerName} — {discipline.name}
            </TableCell>
            <Show when={showRepeated}>
              <TableCell>
                <Show when={discipline.notAttestedTwice} fallback={emptyResult}>
                  <Badge variant="red">{t('repeated-result')}</Badge>
                </Show>
              </TableCell>
            </Show>
            <AttestationResultCells results={discipline.results} />
            <TableCell />
          </TableRow>
        ))}
      </Show>
    </Fragment>
  );
};
