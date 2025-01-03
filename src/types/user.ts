interface Group {
  id: number;
  name: string;
}

interface StudentProfile {
  speciality: string;
  studyGroup: Group;
  gradeBookNumber: string;
  studyYear: number;
  codeOfHonorSigned: boolean;
  faculty: string;
  status: string;
  formOfEducation: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  scientificInterests?: string;
  userIdentifier: string;
  fullName: string;
  fullNameEnglish: string;
  photo: string;
  credo: string;
  sid: string;
  modules: string[];
  intellectProfileEnabled: boolean;
  intellectProfile?: string;
  userCategories: (keyof typeof USER_CATEGORIES)[];
  studentProfile?: StudentProfile;
}

export const USER_CATEGORIES = {
  Student: 'Студент',
  Lecturer: 'НПП',
};
