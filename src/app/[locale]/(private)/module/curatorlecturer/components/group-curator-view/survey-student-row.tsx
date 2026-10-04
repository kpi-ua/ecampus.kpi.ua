'use client';

import { Fragment, useState } from 'react';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { CuratorSurveyRow } from '../../types';

interface Props {
  rows: CuratorSurveyRow[];
}

export const SurveyStudentRow = ({ rows }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.results');
  const [expanded, setExpanded] = useState(false);
  const completed = rows.filter((row) => row.hasVoted).length;
  const badgeVariant = completed === rows.length ? 'success' : completed === 0 ? 'error' : 'neutral';

  const handleExpand = () => {
    setExpanded((current) => !current);
  };

  return (
    <Fragment>
      <TableRow>
        <TableCell className="font-semibold">{rows[0].fullName}</TableCell>
        <TableCell className="w-64 text-center">
          <Badge variant={badgeVariant}>{t('completed-count', { completed, total: rows.length })}</Badge>
        </TableCell>
        <TableCell className="w-12 text-right">
          <button
            type="button"
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100"
            onClick={handleExpand}
          >
            {expanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
        </TableCell>
      </TableRow>
      <Show when={expanded}>
        {rows.map((row) => (
          <TableRow key={`${row.discipline.id}-${row.employeeId}`} className="bg-neutral-50 hover:bg-neutral-50">
            <TableCell className="py-3 pl-6 text-sm">
              {row.lecturerName} — {row.discipline.name}
            </TableCell>
            <TableCell className="w-64 py-3">
              <Show when={row.hasVoted} fallback={<X className="mx-auto size-5 shrink-0 text-red-600" />}>
                <Check className="mx-auto size-5 shrink-0 text-green-600" />
              </Show>
            </TableCell>
            <TableCell className="w-12 py-3" />
          </TableRow>
        ))}
      </Show>
    </Fragment>
  );
};
