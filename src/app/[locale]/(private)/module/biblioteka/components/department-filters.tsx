'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import qs from 'query-string';
import { useEffect, useMemo } from 'react';

import { getBibliotekaEmployees } from '@/actions/biblioteka.actions';
import { Paragraph } from '@/components/typography';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { BibliotekaDepartment } from '@/types/models/biblioteka';

import { BIBLIOTEKA_STALE_TIME, bibliotekaQueryKeys } from '../query-keys';
import { EmployeesTable } from './employees-table';

interface Props {
  departments: BibliotekaDepartment[];
}

export const DepartmentFilters = ({ departments }: Props) => {
  const t = useTranslations('private.biblioteka');
  const { errorToast } = useServerErrorToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const parseId = (value: string | null) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : undefined;
  };
  const requestedDepartmentId = parseId(searchParams.get('departmentId'));
  const selectedDepartment = departments.find((department) => department.id === requestedDepartmentId);
  const facultyId = parseId(searchParams.get('facultyId')) ?? selectedDepartment?.facultyId;
  const departmentId =
    selectedDepartment && selectedDepartment.facultyId === facultyId ? selectedDepartment.id : undefined;
  const {
    data: employees = [],
    isFetching,
    error,
  } = useQuery({
    queryKey: bibliotekaQueryKeys.employees({ departmentId }),
    queryFn: () => getBibliotekaEmployees({ departmentId }),
    enabled: departmentId !== undefined,
    staleTime: BIBLIOTEKA_STALE_TIME,
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
    const params = qs.parse(searchParams.toString());
    params.facultyId = value;
    delete params.departmentId;
    delete params.page;
    router.replace(qs.stringifyUrl({ url: pathname, query: params }), { scroll: false });
  };

  const handleDepartmentChange = (value: string) => {
    const params = qs.parse(searchParams.toString());
    params.facultyId = String(facultyId);
    params.departmentId = value;
    delete params.page;
    router.replace(qs.stringifyUrl({ url: pathname, query: params }), { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="border-neutral-divider rounded-lg border bg-white p-5 shadow-none sm:p-6">
        <div className="grid min-w-0 gap-6 md:grid-cols-2 md:gap-8">
          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="biblioteka-faculty">{t('departments.faculty')}</Label>
            <Select value={facultyId?.toString() ?? ''} onValueChange={handleFacultyChange}>
              <SelectTrigger
                id="biblioteka-faculty"
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
            <Label htmlFor="biblioteka-department">{t('departments.name')}</Label>
            <Select
              value={departmentId?.toString() ?? ''}
              onValueChange={handleDepartmentChange}
              disabled={facultyId === undefined || facultyDepartments.length === 0}
            >
              <SelectTrigger
                id="biblioteka-department"
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
            <EmployeesTable
              employees={employees}
              exportLabel={selectedDepartment.abbreviation}
              departmentId={selectedDepartment.id}
            />
          ) : (
            <Paragraph className="m-0 py-10 text-center text-sm text-neutral-500">{t('empty')}</Paragraph>
          )}
        </div>
      )}
    </div>
  );
};
