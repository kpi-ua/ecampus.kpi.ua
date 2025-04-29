import React from 'react';
import { StudentProfile } from '@/types/models/student-profile';
import { InfoItem, InfoList } from './info-list';
import { dash } from 'radash';
import { StudyForm } from '@/types/enums/study-form';
import { getTranslations } from 'next-intl/server';

interface Props {
  studentProfile: StudentProfile;
}

export async function StudentInfo({ studentProfile }: Props) {
  const t = await getTranslations('private.profile');
  const tEnums = await getTranslations('global.enums');

  const studentInfo: InfoItem[] = [
    { label: t('info.subdivision'), value: studentProfile.faculty },
    { label: t('info.group'), value: studentProfile.studyGroup.name },
    {
      label: t('info.education-form'),
      value: tEnums(`study-form.${dash(studentProfile.studyForm || StudyForm.None)}`),
    },
    { label: t('info.study-year'), value: studentProfile.studyYear },
    { label: t('info.speciality'), value: studentProfile.speciality },
  ];

  return <InfoList items={studentInfo} />;
}
