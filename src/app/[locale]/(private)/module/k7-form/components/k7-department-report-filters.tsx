'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { K7FormLecturerProfileOption, K7ReportRequest } from '@/types/models/k7-form';

import { useK7ReportGeneration } from '../hooks';
import { K7AcademicYearSelect } from './k7-academic-year-select';

interface Props {
  years: number[];
  profiles: K7FormLecturerProfileOption[];
  reports: K7ReportRequest[];
  onRequestCreated: (request: K7ReportRequest) => void;
}

export const K7DepartmentReportFilters = ({ years, profiles, reports, onRequestCreated }: Props) => {
  const t = useTranslations('private.k-7');
  const [selectedYear, setSelectedYear] = useState(years[0]?.toString() ?? '');
  const [selectedProfile, setSelectedProfile] = useState('');
  const selectedYearNumber = selectedYear === '' ? undefined : Number(selectedYear);
  const selectedProfileData = selectedProfile === '' ? undefined : profiles[Number(selectedProfile)];
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
        onValueChange={setSelectedYear}
        disabled={isSubmitting}
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="work-profile-department">{t('filters.lecturerProfile')}</Label>
        <Select
          value={selectedProfile}
          onValueChange={setSelectedProfile}
          disabled={isSubmitting || profiles.length === 0}
        >
          <SelectTrigger
            id="work-profile-department"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={t('filters.selectLecturerProfile')} />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile, index) => (
              <SelectItem
                key={`${profile.userAccountId}-${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                value={String(index)}
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
