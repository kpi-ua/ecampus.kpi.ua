'use client';

import { useTranslations } from 'next-intl';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { ATTESTATION_COLUMNS, ATTESTATION_RESULT } from '../../constants';
import { CuratorStudentAttestation, CuratorAttestationDiscipline } from '../../types';
import { EmptyRow } from '../EmptyRow';
import { AttestationStudentRow } from './attestation-student-row';
import { AttestationDisciplineRow } from './attestation-discipline-row';
import { LoadingRow } from './loading-row';

interface Props {
  students: CuratorStudentAttestation[];
  disciplines: CuratorAttestationDiscipline[];
  search: string;
  view: string;
  onlyNotAttested: boolean;
  onlyRepeated: boolean;
  showRepeated: boolean;
  isFetching: boolean;
}

export const AttestationTable = ({
  students,
  disciplines,
  search,
  view,
  onlyNotAttested,
  onlyRepeated,
  showRepeated,
  isFetching,
}: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const colSpan = ATTESTATION_COLUMNS.length + 2 + Number(showRepeated);
  const query = search.trim().toLocaleLowerCase();
  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLocaleLowerCase().includes(query) &&
      (!onlyNotAttested || student.notAttested > 0) &&
      (!showRepeated || !onlyRepeated || student.notAttestedTwiceCount > 0),
  );

  const filteredDisciplines = disciplines.filter(
    (discipline) =>
      `${discipline.name} ${discipline.lecturerName}`.toLocaleLowerCase().includes(query) &&
      (!onlyNotAttested || discipline.results.some((result) => result.result === ATTESTATION_RESULT.NotAttested)) &&
      (!showRepeated || !onlyRepeated || discipline.notAttestedTwiceCount > 0),
  );

  return (
    <div className="border-neutral-divider overflow-hidden rounded-lg border bg-white">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="hover:bg-white [&>th]:bg-neutral-100 [&>th]:text-xs [&>th]:uppercase">
            <TableHead>{view === 'students' ? t('results.student') : t('results.discipline')}</TableHead>
            <Show when={showRepeated}>
              <TableHead>{t('results.not-attested-twice')}</TableHead>
            </Show>
            {ATTESTATION_COLUMNS.map((column) => (
              <TableHead key={column.label}>{t(`results.${column.label}`)}</TableHead>
            ))}
            <TableHead>
              <span className="sr-only">{t('results.disciplines')}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={!isFetching} fallback={<LoadingRow colSpan={colSpan} />}>
            <Show
              when={view === 'students'}
              fallback={
                <Show when={filteredDisciplines.length > 0} fallback={<EmptyRow colSpan={colSpan} />}>
                  {filteredDisciplines.map((discipline) => (
                    <AttestationDisciplineRow
                      key={`${discipline.disciplineId}-${discipline.employeeId}`}
                      discipline={discipline}
                      showRepeated={showRepeated}
                    />
                  ))}
                </Show>
              }
            >
              <Show when={filteredStudents.length > 0} fallback={<EmptyRow colSpan={colSpan} />}>
                {filteredStudents.map((student) => (
                  <AttestationStudentRow key={student.studentId} student={student} showRepeated={showRepeated} />
                ))}
              </Show>
            </Show>
          </Show>
        </TableBody>
      </Table>
    </div>
  );
};
