import { StudentStatus } from '../enums/student-status';
import { StudyForm } from '../enums/study-form';

interface Group {
  id: number;
  name: string;
}

export interface StudentProfile {
  speciality: string;
  studyGroup: Group;
  gradeBookNumber: string;
  studyYear: number;
  codeOfHonorSigned: boolean;
  faculty: string;
  status: StudentStatus;
  studyForm: StudyForm;
}
