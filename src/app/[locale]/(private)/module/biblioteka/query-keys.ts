export const LIBRARY_STALE_TIME = 5 * 60 * 1000;

export const libraryQueryKeys = {
  employees: (filter: { departmentId?: number; letter?: string }) => ['library', 'employees', filter] as const,
  employee: (userAccountId: number | null, employeeId: number) =>
    ['library', 'employee', userAccountId, employeeId] as const,
};
