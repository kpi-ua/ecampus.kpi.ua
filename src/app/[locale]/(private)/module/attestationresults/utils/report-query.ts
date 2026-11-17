import { AttestationReportOptions, AttestationReportQuery } from '../types';

export const getAttestationReportQuery = (
  params: Record<string, string | string[] | undefined>,
  options: AttestationReportOptions,
): AttestationReportQuery => ({
  departmentId: Number(params.departmentId ?? options.departments[0]?.id),
  yearId: Number(params.yearId ?? options.currentYearId),
  semester: Number(params.semester ?? 1),
  attestationId: Number(params.attestationId ?? options.attestations[0]?.id),
  ...(params.groupId ? { groupId: Number(params.groupId) } : {}),
  ...(params.course ? { course: Number(params.course) } : {}),
  ...(params.studentId ? { studentId: Number(params.studentId) } : {}),
});
