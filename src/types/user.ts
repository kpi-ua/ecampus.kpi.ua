import { StudentProfile } from '@/types/student-profile';
import { EmployeeProfile } from '@/types/employee-profile';
import { USER_CATEGORIES } from '@/types/constants';

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
  codeOfHonorSignDate: string;
  studentProfile?: StudentProfile;
  employeeProfile?: EmployeeProfile;
}
