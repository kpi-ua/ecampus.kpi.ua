import { K7EducationCategory } from '@/types/models/k7-form';

type EmployeeCategoryTranslationKey = 'npp' | 'pp';

export const EMPLOYEE_CATEGORY_TRANSLATION_KEYS: Record<string, EmployeeCategoryTranslationKey> = {
  NPP: 'npp',
  PP: 'pp',
};

export const EDUCATION_CATEGORY_TITLES: Record<K7EducationCategory, string> = {
  Bachelor: 'бакалаврів',
  MasterProfessional: 'магістрів ОПП',
  MasterScientific: 'магістрів ОНП',
};
