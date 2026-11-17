import { AttestationReport } from '../types';

export const getAttestationReportTables = (report: AttestationReport) =>
  report.groups.map((group) => {
    const results = report.results.filter((result) => result.groupId === group.id);
    const columns = [
      ...new Map(results.map((result) => [`${result.disciplineId}-${result.employeeId}`, result])).values(),
    ];
    const students = report.students.filter((student) => student.groupId === group.id);
    const cells = new Map(
      results.map((result) => [`${result.studentId}-${result.disciplineId}-${result.employeeId}`, result.result]),
    );
    return { group, columns, students, cells };
  });
