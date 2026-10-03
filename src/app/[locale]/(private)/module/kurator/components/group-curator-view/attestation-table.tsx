'use client';

import { useTranslations } from 'next-intl';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { ATTESTATION_COLUMNS, ATTESTATION_RESULT } from '../../constants';
import { CuratorAttestationStudent } from '../../types';
import { EmptyRow } from '../EmptyRow';
import { AttestationStudentRow } from './attestation-student-row';
import { AttestationDisciplineRow } from './attestation-discipline-row';
import { LoadingRow } from './loading-row';

interface Props {
  students: CuratorAttestationStudent[];
  search: string;
  view: string;
  onlyNotAttested: boolean;
  onlyRepeated: boolean;
  showRepeated: boolean;
  isFetching: boolean;
}

export const AttestationTable = ({
  students,
  search,
  view,
  onlyNotAttested,
  onlyRepeated,
  showRepeated,
  isFetching,
}: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const colSpan = ATTESTATION_COLUMNS.length + 2 + Number(showRepeated);
  const query = search.trim().toLocaleLowerCase();
  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLocaleLowerCase().includes(query) &&
      (!onlyNotAttested || student.notAttested > 0) &&
      (!showRepeated || !onlyRepeated || student.notAttestedTwice > 0),
  );

  const disciplines = Array.from(
    students
      .flatMap((student) => student.results)
      .reduce((groups, result) => {
        const key = `${result.discipline.id}-${result.employeeId}`;
        const group = groups.get(key) ?? {
          key,
          name: result.discipline.name,
          lecturerName: result.lecturerName,
          results: [],
        };
        group.results.push(result);
        groups.set(key, group);
        return groups;
      }, new Map<string, { key: string; name: string; lecturerName: string; results: (typeof students)[number]['results'] }>()),
  )
    .map(([, discipline]) => discipline)
    .filter(
      (discipline) =>
        `${discipline.name} ${discipline.lecturerName}`.toLocaleLowerCase().includes(query) &&
        (!onlyNotAttested || discipline.results.some((result) => result.result === ATTESTATION_RESULT.NotAttested)) &&
        (!showRepeated || !onlyRepeated || discipline.results.some((result) => result.notAttestedTwice)),
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
                <Show when={disciplines.length > 0} fallback={<EmptyRow colSpan={colSpan} />}>
                  {disciplines.map((discipline) => (
                    <AttestationDisciplineRow
                      key={discipline.key}
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
