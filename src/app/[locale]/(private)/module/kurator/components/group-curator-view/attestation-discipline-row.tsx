'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { CuratorAttestationRow } from '../../types';

interface Props {
  discipline: {
    name: string;
    lecturerName: string;
    results: CuratorAttestationRow[];
  };
}

export const AttestationDisciplineRow = ({ discipline }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator.results');
  const [expanded, setExpanded] = useState(false);
  const repeated = discipline.results.filter(
    (result) => result.result === 'na' && result.previousResult === 'na',
  ).length;
  const statuses = [
    { result: 'a', label: 'attested-code', variant: 'success' },
    { result: null, label: 'missing-code', variant: 'yellow' },
    { result: 'na', label: 'not-attested-code', variant: 'error' },
    { result: 'nv', label: 'not-studying-code', variant: 'neutral' },
  ] as const;

  return (
    <>
      <TableRow>
        <TableCell className="font-semibold">
          {discipline.name} — {discipline.lecturerName}
        </TableCell>
        <TableCell>
          <Show when={repeated > 0} fallback="—">
            <Badge variant="red">{repeated}</Badge>
          </Show>
        </TableCell>
        {statuses.map((status) => (
          <TableCell key={status.label}>
            <Badge variant={status.variant}>
              {discipline.results.filter((result) => result.result === status.result).length} {t(status.label)}
            </Badge>
          </TableCell>
        ))}
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
        {discipline.results.map((result) => (
          <TableRow key={result.studentId} className="bg-neutral-50 hover:bg-neutral-50">
            <TableCell className="pl-6">{result.fullName}</TableCell>
            <TableCell>
              <Show when={result.result === 'na' && result.previousResult === 'na'} fallback="—">
                <Badge variant="red">{t('repeated-result')}</Badge>
              </Show>
            </TableCell>
            {statuses.map((status) => (
              <TableCell key={status.label}>
                <Show when={result.result === status.result} fallback="—">
                  <Badge variant={status.variant}>{t(status.label)}</Badge>
                </Show>
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        ))}
      </Show>
    </>
  );
};
