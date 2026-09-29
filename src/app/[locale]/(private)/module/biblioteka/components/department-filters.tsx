'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useEffect, useMemo } from 'react';

import { getLibraryEmployees } from '@/actions/library.actions';
import { Paragraph } from '@/components/typography';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { LibraryDepartment } from '@/types/models/library';

import { LIBRARY_STALE_TIME, libraryQueryKeys } from '../query-keys';
import { EmployeesTable } from './employees-table';

interface Props {
  departments: LibraryDepartment[];
}

export const DepartmentFilters = ({ departments }: Props) => {
  const t = useTranslations('private.library');
  const { errorToast } = useServerErrorToast();
  const [{ facultyId: requestedFacultyId, departmentId: requestedDepartmentId }, setSelection] = useQueryStates({
    facultyId: parseAsInteger,
    departmentId: parseAsInteger,
    page: parseAsInteger,
  });
  const selectedDepartment = departments.find((department) => department.id === requestedDepartmentId);
  const facultyId = requestedFacultyId ?? selectedDepartment?.facultyId;
  const departmentId =
    selectedDepartment && selectedDepartment.facultyId === facultyId ? selectedDepartment.id : undefined;
  const {
    data: employees = [],
    isFetching,
    error,
  } = useQuery({
    queryKey: libraryQueryKeys.employees({ departmentId }),
    queryFn: () => getLibraryEmployees({ departmentId }),
    enabled: departmentId !== undefined,
    staleTime: LIBRARY_STALE_TIME,
  });
  const faculties = useMemo(
    () => [...new Map(departments.map((department) => [department.facultyId, department])).values()],
    [departments],
  );
  const facultyDepartments = useMemo(
    () => departments.filter((department) => department.facultyId === facultyId),
    [departments, facultyId],
  );
  useEffect(() => {
    if (error) {
      errorToast();
    }
  }, [error, errorToast]);

  const handleFacultyChange = (value: string) => {
    setSelection({ facultyId: Number(value), departmentId: null, page: null });
  };

  const handleDepartmentChange = (value: string) => {
    setSelection({ facultyId: facultyId ?? null, departmentId: Number(value), page: null });
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="border-neutral-divider rounded-lg border bg-white p-5 shadow-none sm:p-6">
        <div className="grid min-w-0 gap-6 md:grid-cols-2 md:gap-8">
          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="library-faculty">{t('departments.faculty')}</Label>
            <Select value={facultyId?.toString() ?? ''} onValueChange={handleFacultyChange}>
              <SelectTrigger
                id="library-faculty"
                variant="small"
                className="border-neutral-300 text-left text-sm text-neutral-900"
              >
                <SelectValue placeholder={t('departments.select-faculty')} />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.facultyId} value={String(faculty.facultyId)}>
                    {faculty.facultyName} ({faculty.facultyAbbreviation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="library-department">{t('departments.name')}</Label>
            <Select
              value={departmentId?.toString() ?? ''}
              onValueChange={handleDepartmentChange}
              disabled={facultyId === undefined || facultyDepartments.length === 0}
            >
              <SelectTrigger
                id="library-department"
                variant="small"
                className="border-neutral-300 text-left text-sm text-neutral-900"
              >
                <SelectValue placeholder={t('departments.select-department')} />
              </SelectTrigger>
              <SelectContent>
                {facultyDepartments.map((department) => (
                  <SelectItem key={department.id} value={String(department.id)}>
                    {department.name} ({department.abbreviation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      {isFetching && <Paragraph className="m-0 py-10 text-center text-sm text-neutral-500">{t('loading')}</Paragraph>}
      {!isFetching && selectedDepartment && (
        <div className="flex flex-col gap-6">
          {employees.length > 0 ? (
            <EmployeesTable employees={employees} departmentId={selectedDepartment.id} />
          ) : (
            <Paragraph className="m-0 py-10 text-center text-sm text-neutral-500">{t('empty')}</Paragraph>
          )}
        </div>
      )}
    </div>
  );
};
