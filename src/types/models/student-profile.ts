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
  status: string;
  formOfEducation: string;
}
