import { type ReactNode } from 'react';

import { getDekanatReport } from '@/actions/dekanat.actions';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { type DekanatOption } from '@/types/models/dekanat';

import { DekanatExport } from '../../components/dekanat-export';
import { DekanatSelect } from '../../components/dekanat-select';
import { type DekanatTranslations } from '../../translations';

export async function AttestationReport({
  t,
  facultyFilter,
  facultyId,
  years,
  periodTypes,
  yearId,
  semester,
  periodTypeId,
}: {
  t: DekanatTranslations;
  facultyFilter: ReactNode;
  facultyId: number | null;
  years: DekanatOption[];
  periodTypes: DekanatOption[];
  yearId: number | null;
  semester: number;
  periodTypeId: number | null;
}) {
  const rows = yearId && periodTypeId ? await getDekanatReport(facultyId, yearId, semester, periodTypeId) : [];

  return (
    <>
      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facultyFilter}
        <DekanatSelect name="yearId" value={yearId} label={t('year')} options={years} />
        <DekanatSelect
          name="semester"
          value={semester}
          label={t('semester')}
          options={[
            { id: 1, name: t('firstSemester') },
            { id: 2, name: t('secondSemester') },
          ]}
        />
        <DekanatSelect name="periodTypeId" value={periodTypeId} label={t('attestation')} options={periodTypes} />
      </div>
      <Show when={rows.length > 0}>
        <div className="flex justify-end">
          <DekanatExport kind="reports" label={t('export')} query={{ facultyId, yearId, semester, periodTypeId }} />
        </div>
      </Show>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('course')}</TableHead>
            <TableHead>{t('educationLevel')}</TableHead>
            <TableHead>{t('groupCount')}</TableHead>
            <TableHead>{t('studentCount')}</TableHead>
            <TableHead>{t('attested')}</TableHead>
            <TableHead>{t('notAttested')}</TableHead>
            <TableHead>{t('threeOrMoreFailures')}</TableHead>
            <TableHead>{t('oneOrTwoFailures')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={rows.length > 0} fallback={<TableEmptyRow colSpan={8}>{t('empty')}</TableEmptyRow>}>
            {rows.map((row) => (
              <TableRow key={`${row.course}-${row.educationLevel}`}>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.educationLevel}</TableCell>
                <TableCell>{row.groupCount}</TableCell>
                <TableCell>{row.studentCount}</TableCell>
                <TableCell>{row.attestedCount}</TableCell>
                <TableCell>{row.notAttestedCount}</TableCell>
                <TableCell>{row.threeOrMoreFailuresCount}</TableCell>
                <TableCell>{row.oneOrTwoFailuresCount}</TableCell>
              </TableRow>
            ))}
          </Show>
        </TableBody>
      </Table>
    </>
  );
}
