export const BIBLIOTEKA_STALE_TIME = 5 * 60 * 1000;

export const bibliotekaQueryKeys = {
  employees: (filter: { departmentId?: number; letter?: string }) => ['biblioteka', 'employees', filter] as const,
  employee: (userAccountId: number | null, employeeId: number) =>
    ['biblioteka', 'employee', userAccountId, employeeId] as const,
};
