import { EducationLevel } from '@/types/enums/education-level';
import { K7_EMPLOYEE_CATEGORY, K7EmployeeCategory } from '@/types/models/k7-form';

type EmployeeCategoryTranslationKey = 'npp' | 'pp';

// The K-7 form is only issued to these two categories; the API refuses to report the others, so
// they have no wording of their own here.
export const EMPLOYEE_CATEGORY_TRANSLATION_KEYS: Partial<Record<K7EmployeeCategory, EmployeeCategoryTranslationKey>> = {
  [K7_EMPLOYEE_CATEGORY.ScientificPedagogical]: 'npp',
  [K7_EMPLOYEE_CATEGORY.Pedagogical]: 'pp',
};

type EducationLevelTranslationKey = 'bachelor' | 'masterProfessional' | 'masterScientific' | 'phd' | 'other';

export const EDUCATION_LEVEL_TRANSLATION_KEYS: Record<EducationLevel, EducationLevelTranslationKey> = {
  [EducationLevel.Bachelor]: 'bachelor',
  [EducationLevel.MasterProfessional]: 'masterProfessional',
  [EducationLevel.MasterScientific]: 'masterScientific',
  [EducationLevel.PhD]: 'phd',
  [EducationLevel.Other]: 'other',
};
