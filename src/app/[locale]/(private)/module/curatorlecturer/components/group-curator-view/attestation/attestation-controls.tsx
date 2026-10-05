'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Heading4 } from '@/components/typography/index';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Show } from '@/components/utils/show';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CuratorFilters } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { AttestationFiltersState } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/attestation/hooks/use-attestation-filters';
import { ResultFilters } from './result-filters';

interface Props {
  groupName: string;
  filters: CuratorFilters;
  state: AttestationFiltersState;
  exportButton: ReactNode;
}

export const AttestationControls = ({ groupName, filters, state, exportButton }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const {
    yearId,
    semester,
    attestationId,
    setYearId,
    setSemester,
    handleAttestationChange,
    onlyNotAttested,
    setOnlyNotAttested,
    onlyRepeated,
    setOnlyRepeated,
    showRepeated,
  } = state;
  return (
    <>
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
            onResultChange={handleAttestationChange}
          />
          {exportButton}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TabsList size="small" className="inline-grid w-max grid-cols-2 bg-white">
          <TabsTrigger value="students">{t('results.by-students')}</TabsTrigger>
          <TabsTrigger value="disciplines">{t('results.by-disciplines')}</TabsTrigger>
        </TabsList>
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
    </>
  );
};
