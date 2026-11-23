import { loadAttestationReportSearchParams } from '../search-params';
import { AttestationReportOptions, AttestationReportQuery } from '../types';

export const getAttestationReportQuery = (
  params: Record<string, string | string[] | undefined>,
  options: AttestationReportOptions,
): AttestationReportQuery => {
  const query = loadAttestationReportSearchParams(params);
  return {
    departmentId: query.departmentId ?? options.departments[0]?.id,
    yearId: query.yearId ?? options.currentYearId,
    semester: query.semester,
    attestationId: query.attestationId ?? options.attestations[0]?.id,
    ...(query.groupId !== null ? { groupId: query.groupId } : {}),
    ...(query.course !== null ? { course: query.course } : {}),
    ...(query.studentId !== null ? { studentId: query.studentId } : {}),
  };
};
