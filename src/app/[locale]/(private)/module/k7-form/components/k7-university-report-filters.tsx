'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Controller, useForm, useWatch } from 'react-hook-form';

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
  year: string;
  facultyId: string;
  departmentId: string;
  profileIndex: string;
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
    defaultValues: {
      year: years[0]?.toString() ?? '',
      facultyId: '',
      departmentId: '',
      profileIndex: '',
    },
  });
  const [selectedYear, selectedFaculty, selectedDepartment, selectedProfile] = useWatch({
    control,
    name: ['year', 'facultyId', 'departmentId', 'profileIndex'],
  });
  const selectedYearNumber = selectedYear === '' ? undefined : Number(selectedYear);
  const selectedFacultyId = selectedFaculty === '' ? undefined : Number(selectedFaculty);
  const selectedDepartmentId = selectedDepartment === '' ? undefined : Number(selectedDepartment);
  const selectedProfileData = selectedProfile === '' ? undefined : departmentProfiles[Number(selectedProfile)];
  const facultyCathedras = useMemo(
    () => cathedras.filter((cathedra) => cathedra.facultyId === selectedFacultyId),
    [cathedras, selectedFacultyId],
  );
  const { generate, isSubmitting, canGenerate } = useK7ReportGeneration({
    reports,
    selectedProfile: selectedProfileData,
    selectedYear: selectedYearNumber,
    targetUserAccountId: selectedProfileData?.userAccountId,
    onRequestCreated,
  });

  useEffect(() => {
    onFilterChange({
      year: selectedYearNumber,
      facultyId: selectedFacultyId,
      departmentId: selectedDepartmentId,
      targetAccountId: selectedProfileData?.userAccountId,
      employeeId: selectedProfileData?.employeeId,
      position: selectedProfileData?.position,
    });
  }, [onFilterChange, selectedDepartmentId, selectedFacultyId, selectedProfileData, selectedYearNumber]);

  const handleFacultyChange = (facultyId: string) => {
    lecturerRequestId.current += 1;
    setValue('facultyId', facultyId);
    setValue('departmentId', '');
    setValue('profileIndex', '');
    setDepartmentProfiles([]);
    setIsLoadingLecturers(false);
  };

  const handleDepartmentChange = async (departmentId: string) => {
    const requestId = ++lecturerRequestId.current;
    const parsedDepartmentId = Number(departmentId);

    setValue('departmentId', departmentId);
    setValue('profileIndex', '');
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
      <Controller
        control={control}
        name="year"
        render={({ field }) => (
          <K7AcademicYearSelect
            id="academic-year-university"
            years={years}
            value={field.value}
            onValueChange={field.onChange}
            disabled={isSubmitting}
          />
        )}
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="faculty-university">{tFilters('faculty')}</Label>
        <Controller
          control={control}
          name="facultyId"
          render={({ field }) => (
            <Select
              value={field.value}
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
          )}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="department-university">{tFilters('cathedra')}</Label>
        <Controller
          control={control}
          name="departmentId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={handleDepartmentChange}
              disabled={isSubmitting || selectedFacultyId === undefined || facultyCathedras.length === 0}
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
          )}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="lecturer-university">{tFilters('lecturerProfile')}</Label>
        <Controller
          control={control}
          name="profileIndex"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={
                isSubmitting ||
                selectedDepartmentId === undefined ||
                isLoadingLecturers ||
                departmentProfiles.length === 0
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
          )}
        />
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
