import { K7_EDUCATION_LEVEL, K7EducationLevel } from '@/types/models/k7-form';

type EmployeeCategoryTranslationKey = 'npp' | 'pp';

export const EMPLOYEE_CATEGORY_TRANSLATION_KEYS: Record<string, EmployeeCategoryTranslationKey> = {
  NPP: 'npp',
  PP: 'pp',
};

export const EDUCATION_LEVEL_TITLES: Record<K7EducationLevel, string> = {
  [K7_EDUCATION_LEVEL.Bachelor]: 'бакалаврів',
  [K7_EDUCATION_LEVEL.MasterProfessional]: 'магістрів ОПП',
  [K7_EDUCATION_LEVEL.MasterScientific]: 'магістрів ОНП',
  [K7_EDUCATION_LEVEL.PhD]: 'аспірантів',
  [K7_EDUCATION_LEVEL.Other]: 'інше',
};
