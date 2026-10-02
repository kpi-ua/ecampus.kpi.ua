'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getCuratorAttestations } from '@/actions/curator.actions';
import { Heading4 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Show } from '@/components/utils/show';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { CuratorFilters } from '../../types';
import { exportAttestations } from '../../utils/export-attestations';
import { EmptyRow } from '../EmptyRow';
import { AttestationStudentRow } from './attestation-student-row';
import { AttestationDisciplineRow } from './attestation-discipline-row';
import { AttestationSummary } from './attestation-summary';
import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from './query-keys';
import { LoadingRow } from './loading-row';
import { ResultFilters } from './result-filters';

interface Props {
  groupId: number;
  groupName: string;
  filters: CuratorFilters;
  defaultYearId: number;
}

export const AttestationTab = ({ groupId, groupName, filters, defaultYearId }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('students');
  const [onlyNotAttested, setOnlyNotAttested] = useState(false);
  const [onlyRepeated, setOnlyRepeated] = useState(false);
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
  const { errorToast } = useServerErrorToast();
  const exportMutation = useMutation({
    mutationFn: () => exportAttestations(groupId, params),
    onError: () => errorToast(),
  });
  const query = search.trim().toLocaleLowerCase();
  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLocaleLowerCase().includes(query) &&
      (!onlyNotAttested || student.notAttested > 0) &&
      (!onlyRepeated || student.notAttestedTwice > 0),
  );

  const disciplines = Array.from(
    students
      .flatMap((student) => student.results)
      .reduce((groups, result) => {
        const key = `${result.discipline.id}-${result.employeeId}-${result.semester}`;
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
        (!onlyNotAttested || discipline.results.some((result) => result.result === 'na')) &&
        (!onlyRepeated ||
          discipline.results.some((result) => result.result === 'na' && result.previousResult === 'na')),
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-6">
        <Heading4 className="m-0 shrink-0">{t('attestation.title', { group: groupName })}</Heading4>
        <div className="ml-auto flex flex-wrap items-center gap-6">
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
          <Button
            variant="secondary"
            size="small"
            loading={exportMutation.isPending}
            disabled={!yearId || !attestationId}
            onClick={() => exportMutation.mutate()}
          >
            <Download />
            {t('export')}
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={view} onValueChange={setView}>
          <TabsList size="small" className="inline-grid w-max grid-cols-2 bg-white">
            <TabsTrigger value="students">{t('results.by-students')}</TabsTrigger>
            <TabsTrigger value="disciplines">{t('results.by-disciplines')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-6">
          <Label className="flex items-center gap-3">
            {t('results.only-not-attested')}
            <Switch checked={onlyNotAttested} onCheckedChange={setOnlyNotAttested} />
          </Label>
          <Label className="flex items-center gap-3">
            {t('results.only-repeated')}
            <Switch checked={onlyRepeated} onCheckedChange={setOnlyRepeated} />
          </Label>
        </div>
      </div>
      <Show when={!isFetching}>
        <AttestationSummary
          students={students}
          attestationName={filters.attestations.find((item) => item.id === Number(attestationId))?.name ?? ''}
        />
      </Show>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={view === 'students' ? t('filters.student-search') : t('results.discipline-search')}
      />
      <div className="border-neutral-divider overflow-hidden rounded-lg border bg-white">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="hover:bg-white [&>th]:bg-neutral-100 [&>th]:text-xs [&>th]:uppercase">
              <TableHead>{view === 'students' ? t('results.student') : t('results.discipline')}</TableHead>
              <TableHead>{t('results.not-attested-twice')}</TableHead>
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
            <Show when={!isFetching} fallback={<LoadingRow colSpan={7} />}>
              <Show
                when={view === 'students'}
                fallback={
                  <Show when={disciplines.length > 0} fallback={<EmptyRow colSpan={7} />}>
                    {disciplines.map((discipline) => (
                      <AttestationDisciplineRow key={discipline.key} discipline={discipline} />
                    ))}
                  </Show>
                }
              >
                <Show when={filteredStudents.length > 0} fallback={<EmptyRow colSpan={7} />}>
                  {filteredStudents.map((student) => (
                    <AttestationStudentRow key={student.studentId} student={student} />
                  ))}
                </Show>
              </Show>
            </Show>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
