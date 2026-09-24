import { K7FormLecturerProfile } from '@/types/models/k7-form';

export const getProfileKey = (profile: K7FormLecturerProfile & { userAccountId?: number }) =>
  JSON.stringify([profile.userAccountId, profile.employeeId, profile.departmentId, profile.position]);
