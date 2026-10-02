'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { CuratorAttestationStudent } from '../../types';

interface Props {
  student: CuratorAttestationStudent;
}

const emptyResult = '—';

export const AttestationStudentRow = ({ student }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator.results');
  const [expanded, setExpanded] = useState(false);

  return (
    <Fragment>
      <TableRow>
        <TableCell className="font-semibold">{student.fullName}</TableCell>
        <TableCell>
          <Show when={student.notAttestedTwice > 0} fallback={emptyResult}>
            <Badge variant="red">{t('repeated-count', { count: student.notAttestedTwice })}</Badge>
          </Show>
        </TableCell>
        <TableCell>
          <Badge variant="success">
            {student.attested} {t('attested-code')}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="yellow">
            {student.missing} {t('missing-code')}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="error">
            {student.notAttested} {t('not-attested-code')}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="neutral">
            {student.notStudying} {t('not-studying-code')}
          </Badge>
        </TableCell>
        <TableCell className="w-12 text-right">
          {student.results.length > 0 && (
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
      {expanded &&
        student.results.map((result) => (
          <TableRow
            key={`${result.discipline.id}-${result.employeeId}-${result.semester}`}
            className="bg-neutral-50 hover:bg-neutral-50"
          >
            <TableCell className="pl-6">
              {result.lecturerName} — {result.discipline.name}
            </TableCell>
            <TableCell>
              <Show when={result.result === 'na' && result.previousResult === 'na'} fallback={emptyResult}>
                <Badge variant="red">{t('repeated-result')}</Badge>
              </Show>
            </TableCell>
            <TableCell>
              {result.result === 'a' ? <Badge variant="success">{t('attested-code')}</Badge> : emptyResult}
            </TableCell>
            <TableCell>
              {result.result === null ? <Badge variant="yellow">{t('missing-code')}</Badge> : emptyResult}
            </TableCell>
            <TableCell>
              {result.result === 'na' ? <Badge variant="error">{t('not-attested-code')}</Badge> : emptyResult}
            </TableCell>
            <TableCell>
              {result.result === 'nv' ? <Badge variant="neutral">{t('not-studying-code')}</Badge> : emptyResult}
            </TableCell>
            <TableCell />
          </TableRow>
        ))}
    </Fragment>
  );
};
