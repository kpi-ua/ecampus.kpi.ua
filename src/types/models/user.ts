import { EmployeeProfile } from '@/types/models/employee-profile';
import { StudentProfile } from '@/types/models/student-profile';

import { UserCategory } from '../enums/user-category';

export interface User {
  id: number;
  username: string;
  email: string;
  corporateEmail?: string | null;
  scientificInterests?: string;
  userIdentifier: string;
  fullName: string;
  photo: string;
  credo: string;
  sid: string;
  modules: string[];
  intellectProfile?: string;
  /** Normalised by `getUserDetails`; the API's `userCategories` field is an obsolete alias of this. */
  roles: UserCategory[];
  codeOfHonorSignDate: string;
  privacyConsentDate?: string | null;
  studentProfile?: StudentProfile;
  employeeProfile?: EmployeeProfile;
}
