import { StudyForm } from '@/types/enums/study-form';

import { GROUP_FILTER_LABELS } from '../constants';
import { CuratorGroup } from '../types';

export const formatGroupDescription = (group: CuratorGroup) =>
  [
    group.educationLevel ? GROUP_FILTER_LABELS.educationLevel[group.educationLevel] : '',
    group.studyForm !== StudyForm.None ? GROUP_FILTER_LABELS.studyForm[group.studyForm] : '',
    group.speciality,
  ]
    .filter(Boolean)
    .join(', ');
