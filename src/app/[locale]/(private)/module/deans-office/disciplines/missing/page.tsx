import { type SearchParams } from 'nuqs/server';

import { getDeansOfficeDisciplines, getDeansOfficePrograms } from '@/actions/deans-office.actions';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';

import { DeansOfficeSelect } from '../../components/deans-office-select';
import { loadDeansOfficeFilters } from '../../load-filters';

export default async function MissingAttestationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { params, options, t, departmentId, semester, periodTypeId } = await loadDeansOfficeFilters(searchParams);

  if (!options.faculties.length) {
    return <Paragraph>{t('noFaculty')}</Paragraph>;
  }

  const { programId } = params;
  const programs = departmentId ? await getDeansOfficePrograms(null, departmentId) : [];
  const ready = Boolean(departmentId && programs.some((program) => program.id === programId));
  const filters =
    departmentId && programId && ready
      ? { facultyId: null, departmentId, programId, semester, periodTypeId: null }
      : null;
  const [disciplines, missingRows] = filters
    ? await Promise.all([
        getDeansOfficeDisciplines(filters),
        periodTypeId ? getDeansOfficeDisciplines({ ...filters, periodTypeId }) : [],
      ])
    : [[], []];
  const rows = missingRows;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="grid grid-cols-2 items-end gap-x-4 gap-y-3 lg:grid-cols-4">
        <DeansOfficeSelect name="departmentId" label={t('department')} options={options.departments} />
        <DeansOfficeSelect name="programId" label={t('program')} options={programs} />
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
      </div>
      <Show when={ready && Boolean(periodTypeId)}>
        <div className="pb-3">
          <Paragraph>{t('missingSummary', { missing: missingRows.length, total: disciplines.length })}</Paragraph>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">{t('discipline')}</TableHead>
              <TableHead>{t('lecturers')}</TableHead>
              <TableHead>{t('groupList')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show when={rows.length > 0} fallback={<TableEmptyRow colSpan={3}>{t('empty')}</TableEmptyRow>}>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="wrap-anywhere">{row.name}</TableCell>
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
