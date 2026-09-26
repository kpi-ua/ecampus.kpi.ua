'use client';

import { Fragment, useState } from 'react';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';

import { CuratorSurveyRow } from '../../types';

interface Props {
  rows: CuratorSurveyRow[];
}

export const SurveyStudentRow = ({ rows }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator.results');
  const [expanded, setExpanded] = useState(false);
  const completed = rows.filter((row) => row.hasVoted).length;
  const badgeVariant = completed === rows.length ? 'success' : completed === 0 ? 'error' : 'neutral';

  return (
    <Fragment>
      <TableRow>
        <TableCell className="font-semibold">{rows[0].fullName}</TableCell>
        <TableCell className="w-64">
          <Badge variant={badgeVariant}>{t('completed-count', { completed, total: rows.length })}</Badge>
        </TableCell>
        <TableCell className="w-12 text-right">
          <button
            type="button"
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100"
            aria-label={expanded ? t('collapse-surveys') : t('expand-surveys')}
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={3} className="p-0">
            <div className="bg-neutral-50 px-6 py-2">
              {rows.map((row) => (
                <div
                  key={`${row.disciplineId}-${row.employeeId}`}
                  className="flex min-h-12 items-center justify-between gap-4 border-b border-neutral-200 py-3 last:border-b-0"
                >
                  <span className="text-sm">
                    {row.disciplineName} — {row.lecturerName}
                  </span>
                  {row.hasVoted ? (
                    <Check className="size-5 shrink-0 text-green-600" aria-label={t('completed')} />
                  ) : (
                    <X className="size-5 shrink-0 text-red-600" aria-label={t('not-completed')} />
                  )}
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
};
