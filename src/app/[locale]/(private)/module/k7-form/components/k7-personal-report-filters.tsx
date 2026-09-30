'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { K7FormFilters, K7ReportRequest } from '@/types/models/k7-form';

import { useK7FilterParams } from '../hooks/use-k7-filter-params';
import { useK7ReportGeneration } from '../hooks/use-k7-report-generation';
import { compareProfile, parseAsProfileId } from '../utils/profile-query';
import { K7AcademicYearSelect } from './k7-academic-year-select';

interface Props {
  filters: K7FormFilters;
  reports: K7ReportRequest[];
  onRequestCreated: (request: K7ReportRequest) => void;
}

export const K7PersonalReportFilters = ({ filters, reports, onRequestCreated }: Props) => {
  const t = useTranslations('private.k-7');
  const [{ year, profile }, setFilters] = useK7FilterParams();
  const selectedYear = year ?? filters.years[0];
  const selectedProfile = profile ?? filters.profiles[0] ?? null;
  const selectedProfileData = filters.profiles.find(compareProfile(selectedProfile));
  const { generate, isSubmitting, canGenerate } = useK7ReportGeneration({
    reports,
    selectedProfile: selectedProfileData,
    selectedYear,
    onRequestCreated,
  });

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <K7AcademicYearSelect
        id="academic-year-personal"
        years={filters.years}
        value={selectedYear?.toString() ?? ''}
        onValueChange={(year) => setFilters({ year: Number(year) })}
        disabled={isSubmitting}
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="work-profile-personal">{t('filters.workProfile')}</Label>
        <Select
          value={parseAsProfileId.serialize(selectedProfile)}
          onValueChange={(profile) => setFilters({ profile: parseAsProfileId.parse(profile) })}
          disabled={isSubmitting || filters.profiles.length === 0}
        >
          <SelectTrigger
            id="work-profile-personal"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={t('filters.selectWorkProfile')} />
          </SelectTrigger>
          <SelectContent>
            {filters.profiles.map((profile) => (
              <SelectItem
                key={`${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                value={parseAsProfileId.serialize(profile)}
              >
                {profile.departmentName} - {profile.position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end lg:col-span-full">
        <Button
          size="small"
          className="h-10 w-full rounded-md px-4 py-0 text-xs sm:w-auto"
          loading={isSubmitting}
          disabled={!canGenerate}
          onClick={generate}
        >
          {t('actions.generate')}
        </Button>
      </div>
    </div>
  );
};
