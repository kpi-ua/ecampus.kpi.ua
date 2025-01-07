import { Paragraph } from '@/components/typography/paragraph';
import React from 'react';
import { StudentProfile } from '@/types/student-profile';
import { useTranslations } from 'next-intl';

interface Props {
  studentProfile: StudentProfile;
}

export function StudentInfo({ studentProfile }: Props) {
  const t = useTranslations('private.profile');

  const studentInfo: { label: string; value?: number | string }[] = [
    {
      label: t('info.subdivision'),
      value: studentProfile?.faculty,
    },
    {
      label: t('info.group'),
      value: studentProfile?.studyGroup.name,
    },
    {
      label: t('info.education-form'),
      value: studentProfile?.formOfEducation,
    },
    {
      label: t('info.study-year'),
      value: studentProfile?.studyYear,
    },
    {
      label: t('info.speciality'),
      value: studentProfile?.speciality,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {studentInfo.map((item, index) => (
        <div key={index} className="flex flex-col gap-3 md:flex-row md:gap-6">
          <Paragraph className="m-0 w-[170px] font-semibold text-neutral-400">{item.label}:</Paragraph>
          <Paragraph className="m-0 font-medium">{item.value}</Paragraph>
        </div>
      ))}
    </div>
  );
}
