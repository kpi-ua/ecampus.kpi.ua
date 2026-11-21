import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getSbpPeriods, getSbpPeriodStudyYears } from '@/actions/sbp-periods.actions';

import { sbpQueryKeys } from '../query-keys';

/** The periods and the study years of the period form; `refresh` reloads the periods after a change. */
export const usePeriods = () => {
  const queryClient = useQueryClient();
  const periods = useQuery({ queryKey: sbpQueryKeys.periods, queryFn: getSbpPeriods, retry: false });
  const studyYears = useQuery({
    queryKey: sbpQueryKeys.periodStudyYears,
    queryFn: getSbpPeriodStudyYears,
    retry: false,
  });

  return {
    periods: periods.data ?? [],
    studyYears: studyYears.data ?? [],
    isReady: periods.isSuccess && studyYears.isSuccess,
    isError: periods.isError || studyYears.isError,
    refresh: () => queryClient.invalidateQueries({ queryKey: sbpQueryKeys.periods, exact: true }),
  };
};
