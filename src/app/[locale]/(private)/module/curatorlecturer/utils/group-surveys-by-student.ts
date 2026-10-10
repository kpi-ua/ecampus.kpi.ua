import { CuratorSurveyRow } from '@/app/[locale]/(private)/module/curatorlecturer/types';

export const groupSurveysByStudent = (rows: CuratorSurveyRow[]): CuratorSurveyRow[][] => {
  const students = new Map<number, CuratorSurveyRow[]>();
  for (const row of rows) {
    const group = students.get(row.studentId);
    if (group) {
      group.push(row);
    } else {
      students.set(row.studentId, [row]);
    }
  }
  return Array.from(students.values());
};
