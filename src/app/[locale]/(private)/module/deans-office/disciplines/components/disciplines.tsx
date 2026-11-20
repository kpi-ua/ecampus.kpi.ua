import { type ReactNode } from 'react';

import { getDeansOfficeDisciplines, getDeansOfficePrograms } from '@/actions/deans-office.actions';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { type DeansOfficeOptions } from '@/types/models/deans-office';

import { DeansOfficeSelect } from '../../components/deans-office-select';
import { type DeansOfficeTranslations } from '../../translations';
import { AttestationSemesterSelect } from './attestation-semester-select';

export async function Disciplines({
  t,
  facultyFilter,
  options,
  facultyId,
  departmentId,
  yearId,
  programId,
  semester,
  periodTypeId,
  missing,
}: {
  t: DeansOfficeTranslations;
  facultyFilter: ReactNode;
  options: DeansOfficeOptions;
  facultyId: number | null;
  departmentId: number | null;
  yearId: number | null;
  programId: number | null;
  semester: number;
  periodTypeId: number | null;
  missing: boolean;
}) {
  const programs = departmentId ? await getDeansOfficePrograms(facultyId, departmentId) : [];
  const ready = Boolean(departmentId && yearId && programs.some((program) => program.id === programId));
  const filters =
    departmentId && yearId && programId && ready
      ? { facultyId, departmentId, yearId, programId, semester: missing ? semester : null, periodTypeId: null }
      : null;
  const [disciplines, missingRows] = filters
    ? await Promise.all([
        getDeansOfficeDisciplines(filters),
        missing && periodTypeId ? getDeansOfficeDisciplines({ ...filters, periodTypeId }) : [],
      ])
    : [[], []];
  const rows = missing ? missingRows : disciplines;

  return (
    <>
      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facultyFilter}
        <DeansOfficeSelect name="yearId" value={yearId} label={t('year')} options={options.years} />
        <DeansOfficeSelect name="departmentId" label={t('department')} options={options.departments} />
        <DeansOfficeSelect name="programId" label={t('program')} options={programs} />
        <Show when={missing}>
          <DeansOfficeSelect
            name="semester"
            value={semester}
            label={t('semester')}
            options={[
              { id: 1, name: t('firstSemester') },
              { id: 2, name: t('secondSemester') },
            ]}
          />
          <DeansOfficeSelect
            name="periodTypeId"
            value={periodTypeId}
            label={t('attestation')}
            options={options.periodTypes}
          />
        </Show>
      </div>
      <Show when={ready && (!missing || Boolean(periodTypeId))}>
        <Show when={missing}>
          <Paragraph>{t('missingSummary', { missing: missingRows.length, total: disciplines.length })}</Paragraph>
        </Show>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('discipline')}</TableHead>
              <TableHead>{t('groupList')}</TableHead>
              <TableHead>{t('lecturers')}</TableHead>
              <Show when={!missing}>
                <TableHead>{t('attestationSemester')}</TableHead>
              </Show>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show
              when={rows.length > 0}
              fallback={<TableEmptyRow colSpan={missing ? 3 : 4}>{t('empty')}</TableEmptyRow>}
            >
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.groupNames ?? EMPTY_VALUE}</TableCell>
                  <TableCell>{row.lecturers ?? EMPTY_VALUE}</TableCell>
                  <Show when={!missing}>
                    <TableCell>
                      <AttestationSemesterSelect id={row.id} semester={row.attestationSemester} />
                    </TableCell>
                  </Show>
                </TableRow>
              ))}
            </Show>
          </TableBody>
        </Table>
      </Show>
    </>
  );
}
