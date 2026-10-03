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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { CuratorFilters } from '../../types';
import { exportAttestations } from '../../utils/export-attestations';
import { AttestationTable } from './attestation-table';
import { AttestationSummary } from './attestation-summary';
import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from './query-keys';
import { ResultFilters } from './result-filters';

interface Props {
  groupId: number;
  groupName: string;
  filters: CuratorFilters;
  defaultYearId: number;
}

export const AttestationTab = ({ groupId, groupName, filters, defaultYearId }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const semesterT = useTranslations('private.curator.lecturer.filters');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('students');
  const [onlyNotAttested, setOnlyNotAttested] = useState(false);
  const [onlyRepeated, setOnlyRepeated] = useState(false);
  const [yearId, setYearId] = useState(String(defaultYearId));
  const [semester, setSemester] = useState('all');
  const [attestationId, setAttestationId] = useState('all');
  const showRepeated = attestationId === 'all';
  const params = {
    yearId: Number(yearId),
    semester: semester === 'all' ? undefined : Number(semester),
    attestationId: attestationId === 'all' ? undefined : Number(attestationId),
  };
  const { data, isFetching } = useQuery({
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
            includeAll
            resultPlaceholder={t('filters.attestation')}
            onYearChange={setYearId}
            onSemesterChange={setSemester}
            onResultChange={(value) => {
              setAttestationId(value);
              setOnlyRepeated(false);
            }}
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
          <Show when={showRepeated}>
            <Label className="flex items-center gap-3">
              {t('results.only-repeated')}
              <Switch checked={onlyRepeated} onCheckedChange={setOnlyRepeated} />
            </Label>
          </Show>
        </div>
      </div>
      <Show when={!isFetching}>
        <AttestationSummary
          students={data?.semesters.flatMap((term) => term.students) ?? []}
          attestationName={
            showRepeated
              ? t('filters.all-attestations')
              : (filters.attestations.find((item) => item.id === Number(attestationId))?.name ?? '')
          }
        />
      </Show>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={view === 'students' ? t('filters.student-search') : t('results.discipline-search')}
      />
      <Show
        when={!!data}
        fallback={
          <AttestationTable
            students={[]}
            disciplines={[]}
            search={search}
            view={view}
            onlyNotAttested={onlyNotAttested}
            onlyRepeated={onlyRepeated}
            showRepeated={showRepeated}
            isFetching={isFetching}
          />
        }
      >
        {data?.semesters.map((term) => (
          <section key={term.semester} className="flex flex-col gap-4">
            <Heading4 className="m-0">{semesterT(term.semester === 1 ? 'first-semester' : 'second-semester')}</Heading4>
            <AttestationTable
              students={term.students}
              disciplines={term.disciplines}
              search={search}
              view={view}
              onlyNotAttested={onlyNotAttested}
              onlyRepeated={onlyRepeated}
              showRepeated={showRepeated}
              isFetching={isFetching}
            />
          </section>
        ))}
      </Show>
    </div>
  );
};
