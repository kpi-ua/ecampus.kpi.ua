import { type SearchParams } from 'nuqs/server';

import { getDeansOfficeDisciplines, getDeansOfficePrograms } from '@/actions/deans-office.actions';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';

import { DeansOfficeSelect } from '../components/deans-office-select';
import { loadDeansOfficeFilters } from '../load-filters';
import { AttestationSemesterSelect } from './components/attestation-semester-select';

export default async function DisciplineSettingsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { params, options, t, departmentId } = await loadDeansOfficeFilters(searchParams);

  if (!options.faculties.length) {
    return <Paragraph>{t('noFaculty')}</Paragraph>;
  }

  const { programId } = params;
  const programs = departmentId ? await getDeansOfficePrograms(null, departmentId) : [];
  const ready = Boolean(departmentId && programs.some((program) => program.id === programId));
  const filters =
    departmentId && programId && ready
      ? { facultyId: null, departmentId, programId, semester: null, periodTypeId: null }
      : null;
  const rows = filters ? await getDeansOfficeDisciplines(filters) : [];

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="grid grid-cols-2 items-end gap-x-4 gap-y-3">
        <DeansOfficeSelect name="departmentId" label={t('department')} options={options.departments} />
        <DeansOfficeSelect name="programId" label={t('program')} options={programs} />
      </div>
      <Show when={ready}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">{t('discipline')}</TableHead>
              <TableHead className="w-52 min-w-52 whitespace-nowrap">{t('attestationSemester')}</TableHead>
              <TableHead>{t('lecturers')}</TableHead>
              <TableHead>{t('groupList')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show when={rows.length > 0} fallback={<TableEmptyRow colSpan={4}>{t('empty')}</TableEmptyRow>}>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="wrap-anywhere">{row.name}</TableCell>
                  <TableCell>
                    <AttestationSemesterSelect id={row.id} semester={row.attestationSemester} />
                  </TableCell>
                  <TableCell>{row.lecturers ?? EMPTY_VALUE}</TableCell>
                  <TableCell>{row.groupNames ?? EMPTY_VALUE}</TableCell>
                </TableRow>
              ))}
            </Show>
          </TableBody>
        </Table>
      </Show>
    </div>
  );
}
