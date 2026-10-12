import { z } from 'zod';

import { CuratorAssignment } from '../types';

export const getAssignmentPeriodError = (startDate: string, endDate: string, assignments: CuratorAssignment[] = []) => {
  if (!startDate || !endDate) return 'required' as const;
  if (!z.iso.date().safeParse(startDate).success || !z.iso.date().safeParse(endDate).success)
    return 'invalid-date' as const;
  if (endDate < startDate) return 'date-order' as const;
  const overlaps = assignments.some((assignment) => {
    const existingStart = assignment.startDate.slice(0, 10);
    const existingEnd = assignment.endDate?.slice(0, 10);
    return existingStart <= endDate && (!existingEnd || existingEnd >= startDate);
  });
  return overlaps ? ('conflict' as const) : null;
};
