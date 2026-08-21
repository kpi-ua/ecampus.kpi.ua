import { K7_EDUCATION_LEVEL, K7_EMPLOYEE_CATEGORY, K7EducationLevel, K7EmployeeCategory } from '@/types/models/k7-form';

type EmployeeCategoryTranslationKey = 'npp' | 'pp';

// The K-7 form is only issued to these two categories; the API refuses to report the others, so
// they have no wording of their own here.
export const EMPLOYEE_CATEGORY_TRANSLATION_KEYS: Partial<Record<K7EmployeeCategory, EmployeeCategoryTranslationKey>> = {
  [K7_EMPLOYEE_CATEGORY.ScientificPedagogical]: 'npp',
  [K7_EMPLOYEE_CATEGORY.Pedagogical]: 'pp',
};

type EducationLevelTranslationKey = 'bachelor' | 'masterProfessional' | 'masterScientific' | 'phd' | 'other';

export const EDUCATION_LEVEL_TRANSLATION_KEYS: Record<K7EducationLevel, EducationLevelTranslationKey> = {
  [K7_EDUCATION_LEVEL.Bachelor]: 'bachelor',
  [K7_EDUCATION_LEVEL.MasterProfessional]: 'masterProfessional',
  [K7_EDUCATION_LEVEL.MasterScientific]: 'masterScientific',
  [K7_EDUCATION_LEVEL.PhD]: 'phd',
  [K7_EDUCATION_LEVEL.Other]: 'other',
};
