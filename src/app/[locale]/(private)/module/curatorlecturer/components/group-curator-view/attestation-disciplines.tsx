'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getCuratorDisciplineAttestations } from '@/actions/curatorlecturer.actions';
import { Heading4 } from '@/components/typography';
import { Input } from '@/components/ui/input';
import { Show } from '@/components/utils/show';
import { CuratorFilters } from '../../types';
import { AttestationSummary } from './attestation-summary';
import { AttestationDisciplineTable } from './attestation-discipline-table';
import { AttestationFiltersState } from './hooks/attestation-tab/use-attestation-filters';
import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from './query-keys';

interface Props {
  groupId: number;
  filters: CuratorFilters;
  state: AttestationFiltersState;
}

export const AttestationDisciplines = ({ groupId, filters, state }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const semesterT = useTranslations('private.curatorlecturer.filters');
  const [search, setSearch] = useState('');
  const { params, onlyNotAttested, onlyRepeated, showRepeated, attestationId } = state;
  const { data, isFetching } = useQuery({
    queryKey: [
      ...curatorGroupQueryKeys.attestations(groupId, params.yearId, params.semester, params.attestationId),
      'disciplines',
    ],
    queryFn: () => getCuratorDisciplineAttestations(groupId, params),
    enabled: !!params.yearId && !!attestationId,
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const summaryStudents = data?.flatMap((term) => term.disciplines.flatMap((discipline) => discipline.students)) ?? [];
  return (
    <div className="flex flex-col gap-6">
      <Show when={!isFetching}>
        <AttestationSummary
          students={summaryStudents}
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
        placeholder={t('results.discipline-search')}
      />
      <Show
        when={!!data}
        fallback={
          <AttestationDisciplineTable
            disciplines={[]}
            search={search}
            onlyNotAttested={onlyNotAttested}
            onlyRepeated={onlyRepeated}
            showRepeated={showRepeated}
            isFetching={isFetching}
          />
        }
      >
        {data?.map((term) => (
          <section key={term.semester} className="flex flex-col gap-4">
            <Heading4 className="m-0">{semesterT(term.semester === 1 ? 'first-semester' : 'second-semester')}</Heading4>
            <AttestationDisciplineTable
              disciplines={term.disciplines}
              search={search}
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
