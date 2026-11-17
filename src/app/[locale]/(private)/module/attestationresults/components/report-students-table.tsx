'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Paragraph } from '@/components/typography';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { useTableSort } from '@/hooks/use-table-sort';

import { AttestationReportGroup, AttestationReportQuery, AttestationReportStudent } from '../types';
import { ReportExportButton } from './report-export-button';

interface Props {
  groups: AttestationReportGroup[];
  query: AttestationReportQuery;
  students: AttestationReportStudent[];
}

interface StudentRow extends AttestationReportGroup {
  studentId: number;
  fullName: string;
}

const columns = [
  { key: 'fullName', label: 'student' },
  { key: 'course', label: 'course' },
  { key: 'name', label: 'group' },
  { key: 'curator', label: 'curator' },
  { key: 'details', label: 'details' },
] as const;

export const ReportStudentsTable = ({ groups, query, students }: Props) => {
  const t = useTranslations('private.attestation-reports');
  const [filters, setFilters] = useState<Partial<Record<keyof StudentRow, string>>>({});
  const groupMap = new Map(groups.map((item) => [item.id, item]));
  const rows: StudentRow[] = students.flatMap((student) => {
    const studentGroup = groupMap.get(student.groupId);
    return studentGroup ? [{ ...studentGroup, studentId: student.studentId, fullName: student.fullName }] : [];
  });
  const filteredRows = rows.filter((row) =>
    columns.every(({ key }) =>
      String(row[key])
        .toLocaleLowerCase()
        .includes((filters[key] ?? '').trim().toLocaleLowerCase()),
    ),
  );
  const { sortedRows, sortHandlers } = useTableSort(filteredRows, undefined, [
    'fullName',
    'course',
    'name',
    'curator',
    'details',
  ]);
  return (
    <Show when={rows.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(({ key, label }) => (
              <TableHead key={key} sortHandlers={sortHandlers} sortHeader={key}>
                {t(label)}
              </TableHead>
            ))}
            <TableHead>{t('results')}</TableHead>
          </TableRow>
          <TableRow>
            {columns.map(({ key, label }) => (
              <TableCell key={key}>
                <Input
                  aria-label={t(label)}
                  placeholder={t(label)}
                  value={filters[key] ?? ''}
                  onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}
                />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow key={row.studentId}>
              {columns.map(({ key }) => (
                <TableCell key={key}>{row[key]}</TableCell>
              ))}
              <TableCell>
                <ReportExportButton query={{ ...query, studentId: row.studentId }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Show>
  );
};
