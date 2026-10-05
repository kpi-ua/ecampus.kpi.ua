'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getCuratorDisciplineAttestations } from '@/actions/curatorlecturer.actions';
import { Heading4 } from '@/components/typography/index';
import { Input } from '@/components/ui/input';
import { Show } from '@/components/utils/show';
import { CuratorFilters } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { ATTESTATION_RESULT } from '@/app/[locale]/(private)/module/curatorlecturer/constants';
import { AttestationSummary } from './attestation-summary';
import { AttestationDisciplineTable } from './attestation-discipline-table';
import { AttestationFiltersState } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/attestation/hooks/use-attestation-filters';
import {
  CURATOR_GROUP_STALE_TIME,
  curatorGroupQueryKeys,
} from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/query-keys';

interface Props {
  groupId: number;
  filters: CuratorFilters;
  state: AttestationFiltersState;
}

export const AttestationDisciplines = ({ groupId, filters, state }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const [search, setSearch] = useState('');
  const { params, onlyNotAttested, onlyRepeated, showRepeated, attestationId } = state;
  const attestationName = showRepeated
    ? t('attestation.both-attestations')
    : (filters.attestations.find((item) => item.id === Number(attestationId))?.name ?? '');
  const { data, isFetching } = useQuery({
    queryKey: [
      ...curatorGroupQueryKeys.attestations(groupId, params.yearId, params.semester, params.attestationId),
      'disciplines',
    ],
    queryFn: () => getCuratorDisciplineAttestations(groupId, params),
    enabled: !!params.yearId && !!attestationId,
    staleTime: CURATOR_GROUP_STALE_TIME,
  });

  const query = search.trim().toLocaleLowerCase();
  const filteredData = data?.semesters.map((term) => ({
    ...term,
    disciplines: term.disciplines.filter(
      (discipline) =>
        `${discipline.name} ${discipline.lecturerName}`.toLocaleLowerCase().includes(query) &&
        (!onlyNotAttested || discipline.results.some((result) => result.result === ATTESTATION_RESULT.NotAttested)) &&
        (!showRepeated || !onlyRepeated || discipline.notAttestedTwiceCount > 0),
    ),
  }));

  return (
    <div className="flex flex-col gap-6">
      <Show when={!isFetching}>
        <AttestationSummary
          students={data?.summaryStudents ?? []}
          attestationName={attestationName}
        />
      </Show>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('results.discipline-search')}
      />
      <Show
        when={!!data}
        fallback={<AttestationDisciplineTable disciplines={[]} showRepeated={showRepeated} isFetching={isFetching} />}
      >
        {filteredData?.map((term) => (
          <section key={term.semester} className="flex flex-col gap-4">
            <Heading4 className="m-0">
              {t('attestation.semester-title', {
                semester: t(term.semester === 1 ? 'attestation.first-semester' : 'attestation.second-semester'),
                attestation: attestationName,
              })}
            </Heading4>
            <AttestationDisciplineTable
              disciplines={term.disciplines}
              showRepeated={showRepeated}
              isFetching={isFetching}
            />
          </section>
        ))}
      </Show>
    </div>
  );
};
