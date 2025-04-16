import { EmployeePosition, EmployeeProfile } from '@/types/models/employee-profile';
import React from 'react';
import { EMPLOYMENT_TYPE } from '@/lib/constants/employment-type';
import { useTranslations } from 'next-intl';
import { InfoItem, InfoList } from './info-list';
import { Heading6 } from '@/components/typography/headers';
import { Show } from '@/components/utils/show';
import { Separator } from '@/components/ui/separator';
import { dash } from 'radash';

interface Props {
  employeeProfile: EmployeeProfile;
}

export function LecturerInfo({ employeeProfile }: Props) {
  const tEnums = useTranslations('global.enums');
  const t = useTranslations('private.profile');

  const employeeInfo: InfoItem[] = [
    { label: t('info.academic-degree'), value: tEnums(`academic-degree.${dash(employeeProfile.academicDegree)}`) },
    { label: t('info.academic-status'), value: tEnums(`academic-status.${dash(employeeProfile.academicStatus)}`) },
  ];

  const formatPositions = (position: EmployeePosition) => {
    return [
      { label: t('info.position'), value: `${position.name} (${EMPLOYMENT_TYPE[position.employment]})` },
      { label: t('info.subdivision'), value: position.subdivision.name },
    ];
  };

  return (
    <div className="flex flex-col gap-4">
      <InfoList items={employeeInfo} />
      <Show when={employeeProfile.positions.length !== 0}>
        <Heading6>{t('info.positions')}</Heading6>
      </Show>
      {employeeProfile.positions.map((position, index) => (
        <React.Fragment key={index}>
          <Separator />
          <InfoList items={formatPositions(position)} />
        </React.Fragment>
      ))}
    </div>
  );
}
