import { type ReactNode } from 'react';

import { getDekanatGroups, getDekanatStudents } from '@/actions/dekanat.actions';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { type DekanatOption } from '@/types/models/dekanat';

import { type DekanatTranslations } from '../../translations';
import { DekanatExport } from '../dekanat-export';
import { DekanatSelect } from '../dekanat-select';
import { RemoveStudentButton } from './remove-student-button';
import { StudentGroupActions } from './student-group-actions';

export async function Roster({
  t,
  facultyFilter,
  facultyId,
  departments,
  departmentId,
  course,
  groupId,
}: {
  t: DekanatTranslations;
  facultyFilter: ReactNode;
  facultyId: number | null;
  departments: DekanatOption[];
  departmentId: number | null;
  course: number | null;
  groupId: number | null;
}) {
  const groups = departmentId && course && course <= 6 ? await getDekanatGroups(facultyId, departmentId, course) : [];
  const selected = groups.find((group) => group.id === groupId);
  const students = selected ? await getDekanatStudents(facultyId, selected.id) : [];

  return (
    <>
      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facultyFilter}
        <DekanatSelect name="departmentId" label={t('department')} options={departments} />
        <DekanatSelect
          name="course"
          label={t('course')}
          options={Array.from({ length: 6 }, (_, i) => ({ id: i + 1, name: String(i + 1) }))}
        />
        <DekanatSelect name="groupId" label={t('group')} options={groups} />
      </div>
      {selected && (
        <>
          <StudentGroupActions key={selected.id} facultyId={facultyId} groupId={selected.id} />
          <div className="flex justify-end">
            <DekanatExport kind="roster" label={t('export')} query={{ facultyId, groupId: selected.id }} />
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
