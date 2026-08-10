'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { K7FormFilters, K7FormLecturerProfileOption } from '@/types/models/k7-form';

interface Props {
  filters: K7FormFilters;
  departmentProfiles: K7FormLecturerProfileOption[];
  type: 'personal' | 'department';
}

export const K7ReportFilters = ({ filters, departmentProfiles, type }: Props) => {
  const t = useTranslations('private.k-reports.k-7');
  const isDepartment = type === 'department';
  const [selectedYear, setSelectedYear] = useState(filters.years[0]?.toString());
  const [selectedProfile, setSelectedProfile] = useState(
    isDepartment || filters.profiles.length === 0 ? undefined : '0',
  );

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor={`academic-year-${type}`}>{t('filters.academicYear')}</Label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger
            id={`academic-year-${type}`}
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={t('filters.selectAcademicYear')} />
          </SelectTrigger>
          <SelectContent>
            {filters.years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}-{year + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor={`work-profile-${type}`}>
          {t(isDepartment ? 'filters.lecturerProfile' : 'filters.workProfile')}
        </Label>
        <Select value={selectedProfile} onValueChange={setSelectedProfile}>
          <SelectTrigger
            id={`work-profile-${type}`}
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue
              placeholder={t(isDepartment ? 'filters.selectLecturerProfile' : 'filters.selectWorkProfile')}
            />
          </SelectTrigger>
          <SelectContent>
            {isDepartment
              ? departmentProfiles.map((profile, index) => (
                  <SelectItem
                    key={`${profile.userAccountId}-${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                    value={index.toString()}
                  >
                    {profile.fullName} - {profile.position}
                  </SelectItem>
                ))
              : filters.profiles.map((profile, index) => (
                  <SelectItem
                    key={`${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                    value={index.toString()}
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
          className="h-10 w-full rounded-[8px] px-4 py-0 text-xs sm:w-auto"
          disabled={!selectedYear || !selectedProfile}
        >
          {t('actions.generate')}
        </Button>
      </div>
    </div>
  );
};
