'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getCuratorAttestations } from '@/actions/curator.actions';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { CuratorFilters } from '../../types';
import { EmptyRow } from '../EmptyRow';
import { AttestationStudentRow } from './attestation-student-row';
import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from './query-keys';
import { LoadingRow } from './loading-row';
import { ResultFilters } from './result-filters';

interface Props {
  groupId: number;
  filters: CuratorFilters;
  defaultYearId: number;
}

export const AttestationTab = ({ groupId, filters, defaultYearId }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const [search, setSearch] = useState('');
  const [yearId, setYearId] = useState(String(defaultYearId));
  const [semester, setSemester] = useState('all');
  const [attestationId, setAttestationId] = useState(filters.attestations[0]?.id.toString() ?? '');
  const params = {
    yearId: Number(yearId),
    semester: semester === 'all' ? undefined : Number(semester),
    attestationId: attestationId ? Number(attestationId) : undefined,
  };
  const { data: students = [], isFetching } = useQuery({
    queryKey: curatorGroupQueryKeys.attestations(groupId, params.yearId, params.semester, params.attestationId),
    queryFn: () => getCuratorAttestations(groupId, params),
    enabled: !!yearId && !!attestationId,
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const query = search.trim().toLocaleLowerCase();
  const filteredStudents = students.filter((student) => student.fullName.toLocaleLowerCase().includes(query));

  return (
    <div className="flex flex-col gap-6">
      <ResultFilters
        filters={filters}
        yearId={yearId}
        semester={semester}
        resultId={attestationId}
        resultOptions={filters.attestations}
        resultPlaceholder={t('filters.attestation')}
        onYearChange={setYearId}
        onSemesterChange={setSemester}
        onResultChange={setAttestationId}
      />
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('filters.student-search')}
      />
      <div className="border-neutral-divider overflow-hidden rounded-lg border bg-white">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>{t('results.student')}</TableHead>
              <TableHead>{t('results.attested')}</TableHead>
              <TableHead>{t('results.missing')}</TableHead>
              <TableHead>{t('results.not-attested')}</TableHead>
              <TableHead>{t('results.not-studying')}</TableHead>
              <TableHead>
                <span className="sr-only">{t('results.disciplines')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <LoadingRow colSpan={6} />
            ) : filteredStudents.length ? (
              filteredStudents.map((student) => <AttestationStudentRow key={student.studentId} student={student} />)
            ) : (
              <EmptyRow colSpan={6} />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
