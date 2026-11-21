export const sbpQueryKeys = {
  userRights: (userAccountId: number) => ['sbp-rights', 'users', userAccountId] as const,
  periods: ['sbp-periods'] as const,
  periodStudyYears: ['sbp-periods', 'study-years'] as const,
};
