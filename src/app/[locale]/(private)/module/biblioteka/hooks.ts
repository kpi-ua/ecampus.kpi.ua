'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useEffect, useMemo } from 'react';

import { getLibraryEmployees } from '@/actions/library.actions';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { type LibraryDepartment } from '@/types/models/library';

import { LIBRARY_STALE_TIME, libraryQueryKeys } from './query-keys';

export const useDepartmentFilters = (departments: LibraryDepartment[]) => {
  const { errorToast } = useServerErrorToast();
  const [{ facultyId: requestedFacultyId, departmentId: requestedDepartmentId }, setSelection] = useQueryStates({
    facultyId: parseAsInteger,
    departmentId: parseAsInteger,
    page: parseAsInteger,
  });
  const requestedDepartment = departments.find((department) => department.id === requestedDepartmentId);
  const facultyId = requestedFacultyId ?? requestedDepartment?.facultyId;
  const selectedDepartment = requestedDepartment?.facultyId === facultyId ? requestedDepartment : undefined;
  const departmentId = selectedDepartment?.id;
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

  const selectFaculty = (nextFacultyId: number) => {
    void setSelection({ facultyId: nextFacultyId, departmentId: null, page: null });
  };

  const selectDepartment = (nextDepartmentId: number) => {
    void setSelection({ facultyId: facultyId ?? null, departmentId: nextDepartmentId, page: null });
  };

  return {
    departmentId,
    employees,
    faculties,
    facultyDepartments,
    facultyId,
    isFetching,
    selectedDepartment,
    selectDepartment,
    selectFaculty,
  };
};
