'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { EntityIdName } from '@/types/models/entity-id-name';
import { K7FormCathedra, K7ReportRequest } from '@/types/models/k7-form';

import { useK7DepartmentProfiles } from '../hooks/use-k7-department-profiles';
import { useK7FilterParams } from '../hooks/use-k7-filter-params';
import { useK7ReportGeneration } from '../hooks/use-k7-report-generation';
import { compareProfile, parseAsProfileId } from '../utils/profile-query';
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
  const [{ year: queryYear, facultyId: queryFacultyId, departmentId: queryDepartmentId, profile }, setFilters] =
    useK7FilterParams();
  const year = queryYear ?? years[0];
  const facultyId = queryFacultyId ?? undefined;
  const departmentId = queryDepartmentId ?? undefined;
  const {
    data: departmentProfiles = [],
    isError: isLecturersError,
    isLoading: isLoadingLecturers,
  } = useK7DepartmentProfiles(departmentId);
  const selectedProfile = departmentProfiles.find(compareProfile(profile));
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

  useEffect(() => {
    if (isLecturersError) {
      errorToast();
    }
  }, [errorToast, isLecturersError]);

  const handleFacultyChange = (facultyId: string) => {
    setFilters({ facultyId: Number(facultyId), departmentId: null, profile: null });
  };

  const handleDepartmentChange = (departmentId: string) => {
    setFilters({ departmentId: Number(departmentId), profile: null });
  };

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-4">
      <K7AcademicYearSelect
        id="academic-year-university"
        years={years}
        value={year?.toString() ?? ''}
        onValueChange={(year) => setFilters({ year: Number(year) })}
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
          value={parseAsProfileId.serialize(profile)}
          onValueChange={(profile) => setFilters({ profile: parseAsProfileId.parse(profile) })}
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
                value={parseAsProfileId.serialize(profile)}
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
