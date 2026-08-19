import {
  K7_EDUCATION_LEVEL,
  K7_EMPLOYEE_CATEGORY,
  K7EducationLevel,
  K7EmployeeCategory,
} from '@/types/models/k7-form';

type EmployeeCategoryTranslationKey = 'npp' | 'pp';

// The K-7 form is only issued to these two categories; the API refuses to report the others, so
// they have no wording of their own here.
export const EMPLOYEE_CATEGORY_TRANSLATION_KEYS: Partial<
  Record<K7EmployeeCategory, EmployeeCategoryTranslationKey>
> = {
  [K7_EMPLOYEE_CATEGORY.ScientificPedagogical]: 'npp',
  [K7_EMPLOYEE_CATEGORY.Pedagogical]: 'pp',
};

export const EDUCATION_LEVEL_TITLES: Record<K7EducationLevel, string> = {
  [K7_EDUCATION_LEVEL.Bachelor]: 'бакалаврів',
  [K7_EDUCATION_LEVEL.MasterProfessional]: 'магістрів ОПП',
  [K7_EDUCATION_LEVEL.MasterScientific]: 'магістрів ОНП',
  [K7_EDUCATION_LEVEL.PhD]: 'аспірантів',
  [K7_EDUCATION_LEVEL.Other]: 'інше',
};
