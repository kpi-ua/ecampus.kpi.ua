import React from 'react';
import { StudentProfile } from '@/types/models/student-profile';
import { useTranslations } from 'next-intl';
import { InfoItem, InfoList } from './info-list';

interface Props {
  studentProfile: StudentProfile;
}

export function StudentInfo({ studentProfile }: Props) {
  const t = useTranslations('private.profile');

  const studentInfo: InfoItem[] = [
    { label: t('info.subdivision'), value: studentProfile?.faculty },
    { label: t('info.group'), value: studentProfile?.studyGroup.name },
    { label: t('info.education-form'), value: studentProfile?.formOfEducation },
    { label: t('info.study-year'), value: studentProfile?.studyYear },
    { label: t('info.speciality'), value: studentProfile?.speciality },
  ];

  return <InfoList items={studentInfo} />;
}
