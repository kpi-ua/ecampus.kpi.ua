import { getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';
import { range } from 'radash';

import { getDeansOfficeGroups, getDeansOfficeOptions, getDeansOfficeStudents } from '@/actions/deans-office.actions';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { DeansOfficeSelect } from './components/deans-office-select';
import { ExportButton } from './components/export-button';
import { RemoveStudentButton } from './components/roster/remove-student-button';
import { StudentGroupActions } from './components/roster/student-group-actions';
import { loadDeansOfficeSearchParams } from './search-params';
import { INTL_NAMESPACE } from './translations';

export default async function RosterPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await loadDeansOfficeSearchParams(searchParams);
  const [options, t] = await Promise.all([getDeansOfficeOptions(null), getTranslations(INTL_NAMESPACE)]);
  const departmentId = options.departments.find((item) => item.id === params.departmentId)?.id ?? null;

  if (!options.faculties.length) {
    return <Paragraph>{t('noFaculty')}</Paragraph>;
  }

  const { course, groupId } = params;
  const groups = departmentId && course && course <= 6 ? await getDeansOfficeGroups(null, departmentId, course) : [];
  const selected = groups.find((group) => group.id === groupId);
  const students = selected ? await getDeansOfficeStudents(null, selected.id) : [];

  return (
    <>
      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DeansOfficeSelect name="departmentId" label={t('department')} options={options.departments} />
        <DeansOfficeSelect
          name="course"
          label={t('course')}
          options={Array.from(range(1, 6), (id) => ({ id, name: String(id) }))}
        />
        <DeansOfficeSelect name="groupId" label={t('group')} options={groups} />
      </div>
      {selected && (
        <>
          <StudentGroupActions key={selected.id} facultyId={null} groupId={selected.id} />
          <div className="flex justify-end">
            <ExportButton kind="roster" label={t('export')} query={{ groupId: selected.id }} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('student')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Show when={students.length > 0} fallback={<TableEmptyRow colSpan={2}>{t('empty')}</TableEmptyRow>}>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <RemoveStudentButton student={student} groupId={selected.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </Show>
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
