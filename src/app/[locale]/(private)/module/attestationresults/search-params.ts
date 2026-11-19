import { createLoader, parseAsInteger } from 'nuqs/server';

export const attestationReportSearchParams = {
  departmentId: parseAsInteger,
  yearId: parseAsInteger,
  semester: parseAsInteger.withDefault(1),
  attestationId: parseAsInteger,
  groupId: parseAsInteger,
  course: parseAsInteger,
  studentId: parseAsInteger,
};

export const loadAttestationReportSearchParams = createLoader(attestationReportSearchParams);
