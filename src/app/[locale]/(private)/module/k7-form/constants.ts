export const K7_DASHBOARD_VIEW = {
  Personal: 'personal',
  Department: 'department',
  University: 'university',
} as const;

export type K7DashboardView = (typeof K7_DASHBOARD_VIEW)[keyof typeof K7_DASHBOARD_VIEW];
