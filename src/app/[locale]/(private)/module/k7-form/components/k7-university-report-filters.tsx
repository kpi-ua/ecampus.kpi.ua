'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useController, useForm } from 'react-hook-form';

import { getK7FormLecturers } from '@/actions/k7-form.actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { EntityIdName } from '@/types/models/entity-id-name';
import { K7FormCathedra, K7FormLecturerProfileOption, K7ReportRequest } from '@/types/models/k7-form';

import { useK7ReportGeneration } from '../hooks';
import { K7AcademicYearSelect } from './k7-academic-year-select';

export interface K7UniversityFilterSelection {
  year?: number;
  facultyId?: number;
  departmentId?: number;
  targetAccountId?: number;
  employeeId?: number;
  position?: string;
}

interface Props {
  years: number[];
  faculties: EntityIdName[];
  cathedras: K7FormCathedra[];
  reports: K7ReportRequest[];
  isLoadingReports: boolean;
  onFilterChange: (selection: K7UniversityFilterSelection) => void;
  onRequestCreated: (request: K7ReportRequest) => void;
}

interface UniversityFilterFormValues {
  year?: number;
  facultyId?: number;
  departmentId?: number;
  profileIndex?: number;
}

export const K7UniversityReportFilters = ({
  years,
  faculties,
  cathedras,
  reports,
  isLoadingReports,
  onFilterChange,
  onRequestCreated,
}: Props) => {
  const t = useTranslations('private.k-7');
  const tFilters = useTranslations('private.k-7.filters');
  const { errorToast } = useServerErrorToast();
  const [departmentProfiles, setDepartmentProfiles] = useState<K7FormLecturerProfileOption[]>([]);
  const [isLoadingLecturers, setIsLoadingLecturers] = useState(false);
  const lecturerRequestId = useRef(0);
  const { control, setValue } = useForm<UniversityFilterFormValues>({
    defaultValues: { year: years[0] },
  });
  const { field: yearField } = useController({ control, name: 'year' });
  const { field: facultyField } = useController({ control, name: 'facultyId' });
  const { field: departmentField } = useController({ control, name: 'departmentId' });
  const { field: profileField } = useController({ control, name: 'profileIndex' });
  const selectedProfile = profileField.value === undefined ? undefined : departmentProfiles[profileField.value];
  const facultyCathedras = useMemo(
    () => cathedras.filter((cathedra) => cathedra.facultyId === facultyField.value),
    [cathedras, facultyField.value],
  );
  const { generate, isSubmitting, canGenerate } = useK7ReportGeneration({
    reports,
    selectedProfile,
    selectedYear: yearField.value,
    targetUserAccountId: selectedProfile?.userAccountId,
    onRequestCreated,
  });

  useEffect(() => {
    onFilterChange({
      year: yearField.value,
      facultyId: facultyField.value,
      departmentId: departmentField.value,
      targetAccountId: selectedProfile?.userAccountId,
      employeeId: selectedProfile?.employeeId,
      position: selectedProfile?.position,
    });
  }, [departmentField.value, facultyField.value, onFilterChange, selectedProfile, yearField.value]);

  const handleFacultyChange = (facultyId: string) => {
    lecturerRequestId.current += 1;
    facultyField.onChange(Number(facultyId));
    setValue('departmentId', undefined);
    setValue('profileIndex', undefined);
    setDepartmentProfiles([]);
    setIsLoadingLecturers(false);
  };

  const handleDepartmentChange = async (departmentId: string) => {
    const requestId = ++lecturerRequestId.current;
    const parsedDepartmentId = Number(departmentId);

    departmentField.onChange(parsedDepartmentId);
    setValue('profileIndex', undefined);
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
    <div className="grid min-w-0 gap-4 lg:grid-cols-4">
      <K7AcademicYearSelect
        id="academic-year-university"
        years={years}
        value={yearField.value?.toString() ?? ''}
        onValueChange={(year) => yearField.onChange(Number(year))}
        disabled={isSubmitting}
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="faculty-university">{tFilters('faculty')}</Label>
        <Select
          value={facultyField.value?.toString() ?? ''}
          onValueChange={handleFacultyChange}
          disabled={isSubmitting || faculties.length === 0}
        >
          <SelectTrigger
            id="faculty-university"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={tFilters('selectFaculty')} />
          </SelectTrigger>
          <SelectContent>
            {faculties.map((faculty) => (
              <SelectItem key={faculty.id} value={String(faculty.id)}>
                {faculty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="department-university">{tFilters('cathedra')}</Label>
        <Select
          value={departmentField.value?.toString() ?? ''}
          onValueChange={handleDepartmentChange}
          disabled={isSubmitting || facultyField.value === undefined || facultyCathedras.length === 0}
        >
          <SelectTrigger
            id="department-university"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={tFilters('selectCathedra')} />
          </SelectTrigger>
          <SelectContent>
            {facultyCathedras.map((cathedra) => (
              <SelectItem key={cathedra.id} value={String(cathedra.id)}>
                {cathedra.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="lecturer-university">{tFilters('lecturerProfile')}</Label>
        <Select
          value={profileField.value?.toString() ?? ''}
          onValueChange={(profileIndex) => profileField.onChange(Number(profileIndex))}
          disabled={
            isSubmitting || departmentField.value === undefined || isLoadingLecturers || departmentProfiles.length === 0
          }
        >
          <SelectTrigger
            id="lecturer-university"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={tFilters('selectLecturerProfile')} />
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

      <div className="flex justify-end lg:col-span-full">
        <Button
          size="small"
          className="h-10 w-full rounded-md px-4 py-0 text-xs sm:w-auto"
          loading={isSubmitting}
          disabled={!canGenerate || isLoadingReports}
          onClick={generate}
        >
          {t('actions.generate')}
        </Button>
      </div>
    </div>
  );
};
