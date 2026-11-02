'use client';

import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';

import { CuratorSurveyRow } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { TableExpandButton } from '@/components/ui/table-expand-button';
import { Show } from '@/components/utils/show';

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
        <TableCell>{rows[0]?.fullName}</TableCell>
        <TableCell className="w-80 text-center">
          <Badge variant={badgeVariant} className="border border-current/20 font-normal">
            {t('completed-count', { completed, total: rows.length })}
          </Badge>
        </TableCell>
        <TableCell className="w-12 text-right">
          <TableExpandButton expanded={expanded} onToggle={handleExpand} />
        </TableCell>
      </TableRow>
      <Show when={expanded}>
        {rows.map((row) => (
          <TableRow
            key={`${row.termId}-${row.discipline.id}-${row.employeeId}`}
            className="border-0 bg-neutral-50 hover:bg-neutral-50"
          >
            <TableCell className="py-2 pl-6 text-sm">
              {row.lecturerName} — {row.discipline.name}
            </TableCell>
            <TableCell className="w-80 py-2">
              <Show
                when={row.hasVoted}
                fallback={
                  <>
                    <X aria-hidden className="mx-auto size-5 shrink-0 text-red-600" />
                    <span className="sr-only">{t('not-completed')}</span>
                  </>
                }
              >
                <Check aria-hidden className="mx-auto size-5 shrink-0 text-green-600" />
                <span className="sr-only">{t('completed')}</span>
              </Show>
            </TableCell>
            <TableCell className="w-12 py-2" />
          </TableRow>
        ))}
      </Show>
    </Fragment>
  );
};
