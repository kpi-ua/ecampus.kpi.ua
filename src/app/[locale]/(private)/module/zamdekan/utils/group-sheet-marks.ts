import { ZamdekanSheetMark } from '../types';

interface StudentMarks {
  studentId: number;
  student: string;
  marks: Record<string, number | null>;
}

interface Assessment {
  key: string;
  description: string | null;
  date: string | null;
  sheetName: string;
  teacher: string;
}

export const groupSheetMarks = (marks: ZamdekanSheetMark[]) => {
  const students = new Map<number, StudentMarks>();
  const assessments = new Map<string, Assessment>();
  for (const mark of marks) {
    const student = students.get(mark.studentId) ?? { studentId: mark.studentId, student: mark.student, marks: {} };
    if (mark.assessmentId !== null) {
      const key = `${mark.employeeSheetId}:${mark.assessmentId}`;
      assessments.set(key, {
        key,
        description: mark.assessmentDescription,
        date: mark.assessmentDate,
        sheetName: mark.sheetName,
        teacher: mark.teacher,
      });
      student.marks[key] = mark.mark;
    }
    students.set(mark.studentId, student);
  }

  return {
    students: [...students.values()],
    assessments: [...assessments.values()].sort(
      (left, right) => (left.date ?? '').localeCompare(right.date ?? '') || left.key.localeCompare(right.key),
    ),
  };
};
