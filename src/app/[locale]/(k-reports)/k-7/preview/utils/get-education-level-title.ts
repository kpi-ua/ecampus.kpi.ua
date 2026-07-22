import { K7OtherEducationalActivity } from '@/types/models/k7-form';

export const getEducationLevelTitle = (row: K7OtherEducationalActivity) => {
  const groupCodes = [row.groupCodesSem1, row.groupCodesSem2].filter(Boolean).join(',').toLowerCase();

  if (!groupCodes) {
    return '—';
  }

  if (/мн(?=\s*(?:\(|,|$))/u.test(groupCodes)) {
    return 'магістрів ОНП';
  }

  if (/мп(?=\s*(?:\(|,|$))/u.test(groupCodes)) {
    return 'магістрів ОПП';
  }

  return 'бакалаврів';
};
