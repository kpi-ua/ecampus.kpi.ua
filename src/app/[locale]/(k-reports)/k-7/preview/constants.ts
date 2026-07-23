import { K7_EDUCATION_CATEGORY, K7EducationCategory } from '@/types/models/k7-form';

type EmployeeCategoryTranslationKey = 'npp' | 'pp';

export const EMPLOYEE_CATEGORY_TRANSLATION_KEYS: Record<string, EmployeeCategoryTranslationKey> = {
  NPP: 'npp',
  PP: 'pp',
};

export const EDUCATION_CATEGORY_TITLES: Record<K7EducationCategory, string> = {
  [K7_EDUCATION_CATEGORY.Bachelor]: 'бакалаврів',
  [K7_EDUCATION_CATEGORY.MasterProfessional]: 'магістрів ОПП',
  [K7_EDUCATION_CATEGORY.MasterScientific]: 'магістрів ОНП',
};
