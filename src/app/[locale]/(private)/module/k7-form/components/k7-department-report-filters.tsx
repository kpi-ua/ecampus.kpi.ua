'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { K7FormLecturerProfileOption, K7ReportRequest } from '@/types/models/k7-form';

import { useK7FilterParams } from '../hooks/use-k7-filter-params';
import { useK7ReportGeneration } from '../hooks/use-k7-report-generation';
import { getProfileKey } from '../utils/get-profile-key';
import { K7AcademicYearSelect } from './k7-academic-year-select';

interface Props {
  years: number[];
  profiles: K7FormLecturerProfileOption[];
  reports: K7ReportRequest[];
  onRequestCreated: (request: K7ReportRequest) => void;
}

export const K7DepartmentReportFilters = ({ years, profiles, reports, onRequestCreated }: Props) => {
  const t = useTranslations('private.k-7');
  const { searchParams, updateFilters } = useK7FilterParams();
  const selectedYear = searchParams.get('year') ?? years[0]?.toString() ?? '';
  const selectedProfile = searchParams.get('profile') ?? '';
  const selectedYearNumber = selectedYear === '' ? undefined : Number(selectedYear);
  const selectedProfileData = profiles.find((profile) => getProfileKey(profile) === selectedProfile);
  const { generate, isSubmitting, canGenerate } = useK7ReportGeneration({
    reports,
    selectedProfile: selectedProfileData,
    selectedYear: selectedYearNumber,
    targetUserAccountId: selectedProfileData?.userAccountId,
    onRequestCreated,
  });

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <K7AcademicYearSelect
        id="academic-year-department"
        years={years}
        value={selectedYear}
        onValueChange={(year) => updateFilters({ year })}
        disabled={isSubmitting}
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="work-profile-department">{t('filters.lecturerProfile')}</Label>
        <Select
          value={selectedProfile}
          onValueChange={(profile) => updateFilters({ profile })}
          disabled={isSubmitting || profiles.length === 0}
        >
          <SelectTrigger
            id="work-profile-department"
            variant="small"
            className="border-neutral-300 text-left text-sm text-neutral-900"
          >
            <SelectValue placeholder={t('filters.selectLecturerProfile')} />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem
                key={`${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                value={getProfileKey(profile)}
              >
                {profile.fullName} - {profile.departmentName} - {profile.position}
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
