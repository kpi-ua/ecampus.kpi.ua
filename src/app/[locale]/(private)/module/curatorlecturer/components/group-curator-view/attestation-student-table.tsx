'use client';

import { useTranslations } from 'next-intl';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { ATTESTATION_COLUMNS } from '../../constants';
import { CuratorStudentAttestation } from '../../types';
import { EmptyRow } from '../EmptyRow';
import { AttestationStudentRow } from './attestation-student-row';
import { LoadingRow } from './loading-row';

interface Props {
  students: CuratorStudentAttestation[];
  search: string;
  onlyNotAttested: boolean;
  onlyRepeated: boolean;
  showRepeated: boolean;
  isFetching: boolean;
}

export const AttestationStudentTable = ({
  students,
  search,
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

  return (
    <div className="border-neutral-divider overflow-hidden rounded-lg border bg-white">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="hover:bg-white [&>th]:bg-neutral-100 [&>th]:text-xs [&>th]:uppercase">
            <TableHead>{t('results.student')}</TableHead>
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
            <Show when={filteredStudents.length > 0} fallback={<EmptyRow colSpan={colSpan} />}>
              {filteredStudents.map((student) => (
                <AttestationStudentRow key={student.studentId} student={student} showRepeated={showRepeated} />
              ))}
            </Show>
          </Show>
        </TableBody>
      </Table>
    </div>
  );
};
