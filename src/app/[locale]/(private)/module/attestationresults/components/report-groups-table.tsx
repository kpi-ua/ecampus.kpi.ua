'use client';

import { useTranslations } from 'next-intl';
import { objectify, listify } from 'radash';
import { useState } from 'react';

import { Paragraph } from '@/components/typography';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { useTableSort } from '@/hooks/use-table-sort';

import { AttestationReportGroup, AttestationReportQuery } from '../types';
import { ReportExportButton } from './report-export-button';

interface Props {
  groups: AttestationReportGroup[];
  query: AttestationReportQuery;
}

const columns = [
  { key: 'course', label: 'course' },
  { key: 'name', label: 'group' },
  { key: 'curator', label: 'curator' },
  { key: 'details', label: 'details' },
] as const;

export const ReportGroupsTable = ({ groups, query }: Props) => {
  const t = useTranslations('private.attestation-reports');
  const [filters, setFilters] = useState(() =>
    objectify(
      columns,
      ({ key }) => key,
      () => '',
    ),
  );
  const filteredRows = groups.filter((row) =>
    listify(filters, (key, value) =>
      String(row[key])
        .toLocaleLowerCase()
        .includes((value ?? '').trim().toLocaleLowerCase()),
    ).every(Boolean),
  );
  const { sortedRows, sortHandlers } = useTableSort(filteredRows, undefined, ['course', 'name', 'curator', 'details']);
  return (
    <Show when={groups.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
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
            <TableRow key={row.id}>
              {columns.map(({ key }) => (
                <TableCell key={key}>{row[key]}</TableCell>
              ))}
              <TableCell>
                <ReportExportButton query={{ ...query, groupId: row.id }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Show>
  );
};
