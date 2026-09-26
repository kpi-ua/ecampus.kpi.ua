'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';

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
          <Badge variant="success">
            {student.attested} {t('attested-code')}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="neutral">
            {student.missing} {t('missing-code')}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="error">
            {student.notAttested} {t('not-attested-code')}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="yellow">
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
          <TableRow key={`${result.disciplineId}-${result.employeeId}`} className="bg-neutral-50 hover:bg-neutral-50">
            <TableCell className="pl-6">
              {result.disciplineName} — {result.lecturerName}
            </TableCell>
            <TableCell>
              {result.result === 'a' ? <Badge variant="success">{t('attested-code')}</Badge> : emptyResult}
            </TableCell>
            <TableCell>
              {result.result === null ? <Badge variant="neutral">{t('missing-code')}</Badge> : emptyResult}
            </TableCell>
            <TableCell>
              {result.result === 'na' ? <Badge variant="error">{t('not-attested-code')}</Badge> : emptyResult}
            </TableCell>
            <TableCell>
              {result.result === 'nv' ? <Badge variant="yellow">{t('not-studying-code')}</Badge> : emptyResult}
            </TableCell>
            <TableCell />
          </TableRow>
        ))}
    </Fragment>
  );
};
