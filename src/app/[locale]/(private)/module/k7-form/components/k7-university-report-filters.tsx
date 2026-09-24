'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { getK7FormLecturers } from '@/actions/k7-form.actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { EntityIdName } from '@/types/models/entity-id-name';
import { K7FormCathedra, K7FormLecturerProfileOption, K7ReportRequest } from '@/types/models/k7-form';

import { useK7FilterParams } from '../hooks/use-k7-filter-params';
import { useK7ReportGeneration } from '../hooks/use-k7-report-generation';
import { getProfileKey } from '../utils/get-profile-key';
import { K7AcademicYearSelect } from './k7-academic-year-select';
import { K7UniversityFilterSelection } from '@/app/[locale]/(private)/module/k7-form/components/types';

interface Props {
  years: number[];
  faculties: EntityIdName[];
  cathedras: K7FormCathedra[];
  reports: K7ReportRequest[];
  isLoadingReports: boolean;
  onFilterChange: (selection: K7UniversityFilterSelection) => void;
  onRequestCreated: (request: K7ReportRequest) => void;
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
  const { searchParams, updateFilters } = useK7FilterParams();
  const selectedYear = searchParams.get('year') ?? years[0]?.toString() ?? '';
  const selectedFaculty = searchParams.get('facultyId') ?? '';
  const selectedDepartment = searchParams.get('departmentId') ?? '';
  const selectedProfileKey = searchParams.get('profile') ?? '';
  const year = selectedYear === '' ? undefined : Number(selectedYear);
  const facultyId = selectedFaculty === '' ? undefined : Number(selectedFaculty);
  const departmentId = selectedDepartment === '' ? undefined : Number(selectedDepartment);
  const selectedProfile = departmentProfiles.find((profile) => getProfileKey(profile) === selectedProfileKey);
  const errorToastRef = useRef(errorToast);
  useEffect(() => {
    errorToastRef.current = errorToast;
  }, [errorToast]);
  const facultyCathedras = useMemo(
    () => cathedras.filter((cathedra) => cathedra.facultyId === facultyId),
    [cathedras, facultyId],
  );
  const { generate, isSubmitting, canGenerate } = useK7ReportGeneration({
    reports,
    selectedProfile,
    selectedYear: year,
    targetUserAccountId: selectedProfile?.userAccountId,
    onRequestCreated,
  });

  useEffect(() => {
    onFilterChange({
      year,
      facultyId,
      departmentId,
      targetAccountId: selectedProfile?.userAccountId,
      employeeId: selectedProfile?.employeeId,
      position: selectedProfile?.position,
    });
  }, [departmentId, facultyId, onFilterChange, selectedProfile, year]);

  const handleFacultyChange = (facultyId: string) => {
    updateFilters({ facultyId, departmentId: undefined, profile: undefined });
  };

  const handleDepartmentChange = (departmentId: string) => {
    updateFilters({ departmentId, profile: undefined });
  };

  useEffect(() => {
    const requestId = ++lecturerRequestId.current;
    const parsedDepartmentId = Number(selectedDepartment);
    setDepartmentProfiles([]);
    if (!selectedDepartment) {
      setIsLoadingLecturers(false);
      return;
    }
    setIsLoadingLecturers(true);
    const loadLecturers = async () => {
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
        if (requestId === lecturerRequestId.current) errorToastRef.current();
      } finally {
        if (requestId === lecturerRequestId.current) setIsLoadingLecturers(false);
      }
    };
    void loadLecturers();
    return () => {
      lecturerRequestId.current += 1;
    };
  }, [selectedDepartment]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-4">
      <K7AcademicYearSelect
        id="academic-year-university"
        years={years}
        value={year?.toString() ?? ''}
        onValueChange={(year) => updateFilters({ year })}
        disabled={isSubmitting}
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="faculty-university">{tFilters('faculty')}</Label>
        <Select
          value={facultyId?.toString() ?? ''}
          onValueChange={handleFacultyChange}
          disabled={isSubmitting || faculties.length === 0}
        >
          <SelectTrigger
            id="faculty-university"
            variant="small"
            className="border-neutral-300 text-left text-sm text-neutral-900"
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
          value={departmentId?.toString() ?? ''}
          onValueChange={handleDepartmentChange}
          disabled={isSubmitting || facultyId === undefined || facultyCathedras.length === 0}
        >
          <SelectTrigger
            id="department-university"
            variant="small"
            className="border-neutral-300 text-left text-sm text-neutral-900"
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
          value={selectedProfileKey}
          onValueChange={(profile) => updateFilters({ profile })}
          disabled={isSubmitting || departmentId === undefined || isLoadingLecturers || departmentProfiles.length === 0}
        >
          <SelectTrigger
            id="lecturer-university"
            variant="small"
            className="border-neutral-300 text-left text-sm text-neutral-900"
          >
            <SelectValue placeholder={tFilters('selectLecturerProfile')} />
          </SelectTrigger>
          <SelectContent>
            {departmentProfiles.map((profile) => (
              <SelectItem
                key={`${profile.userAccountId}-${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                value={getProfileKey(profile)}
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
