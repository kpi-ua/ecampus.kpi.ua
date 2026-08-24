'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { getK7FormLecturers } from '@/actions/k7-form.actions';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { EntityIdName } from '@/types/models/entity-id-name';
import { K7FormLecturerProfileOption } from '@/types/models/k7-form';

import { K7AcademicYearSelect } from './k7-academic-year-select';

export interface K7UniversityFilterSelection {
  year?: number;
  departmentId?: number;
  lecturerUserAccountId?: number;
}

interface Props {
  years: number[];
  departments: EntityIdName[];
  onFilterChange: (selection: K7UniversityFilterSelection) => void;
}

export const K7UniversityReportFilters = ({ years, departments, onFilterChange }: Props) => {
  const t = useTranslations('private.k-7.filters');
  const { errorToast } = useServerErrorToast();
  const [selectedYear, setSelectedYear] = useState(years[0]?.toString() ?? '');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [departmentProfiles, setDepartmentProfiles] = useState<K7FormLecturerProfileOption[]>([]);
  const [isLoadingLecturers, setIsLoadingLecturers] = useState(false);
  const lecturerRequestId = useRef(0);
  const selectedYearNumber = selectedYear === '' ? undefined : Number(selectedYear);
  const selectedDepartmentId = selectedDepartment === '' ? undefined : Number(selectedDepartment);
  const selectedProfileData = selectedProfile === '' ? undefined : departmentProfiles[Number(selectedProfile)];

  useEffect(() => {
    onFilterChange({
      year: selectedYearNumber,
      departmentId: selectedDepartmentId,
      lecturerUserAccountId: selectedProfileData?.userAccountId,
    });
  }, [onFilterChange, selectedDepartmentId, selectedProfileData?.userAccountId, selectedYearNumber]);

  const handleDepartmentChange = async (departmentId: string) => {
    const requestId = ++lecturerRequestId.current;
    const parsedDepartmentId = Number(departmentId);

    setSelectedDepartment(departmentId);
    setSelectedProfile('');
    setDepartmentProfiles([]);
    setIsLoadingLecturers(true);

    try {
      const lecturers = await getK7FormLecturers(parsedDepartmentId);
      if (requestId !== lecturerRequestId.current) return;

      const profiles = lecturers
        .flatMap(({ profiles: lecturerProfiles, ...lecturer }) =>
          lecturerProfiles
            .filter((profile) => profile.departmentId === parsedDepartmentId)
            .map((profile) => ({ ...lecturer, ...profile })),
        )
        .sort(
          (first, second) =>
            first.fullName.localeCompare(second.fullName) || first.position.localeCompare(second.position),
        );

      setDepartmentProfiles(profiles);
    } catch {
      if (requestId === lecturerRequestId.current) errorToast();
    } finally {
      if (requestId === lecturerRequestId.current) setIsLoadingLecturers(false);
    }
  };

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-3">
      <K7AcademicYearSelect
        id="academic-year-university"
        years={years}
        value={selectedYear}
        onValueChange={setSelectedYear}
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="department-university">{t('department')}</Label>
        <Select value={selectedDepartment} onValueChange={handleDepartmentChange} disabled={departments.length === 0}>
          <SelectTrigger
            id="department-university"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={t('selectDepartment')} />
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department.id} value={String(department.id)}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="lecturer-university">{t('lecturer')}</Label>
        <Select
          value={selectedProfile}
          onValueChange={setSelectedProfile}
          disabled={selectedDepartmentId === undefined || isLoadingLecturers || departmentProfiles.length === 0}
        >
          <SelectTrigger
            id="lecturer-university"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={t('selectLecturer')} />
          </SelectTrigger>
          <SelectContent>
            {departmentProfiles.map((profile, index) => (
              <SelectItem
                key={`${profile.userAccountId}-${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                value={String(index)}
              >
                {profile.fullName} - {profile.position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
