import { EmployeeProfile } from '@/types/employee-profile';
import { Paragraph } from '@/components/typography/paragraph';
import { Heading6 } from '@/components/typography/headers';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { EMPLOYMENT_TYPE } from '@/types/constants';
import { useTranslations } from 'next-intl';

interface Props {
  employeeProfile: EmployeeProfile;
}
export function LecturerInfo({ employeeProfile }: Props) {
  const t = useTranslations('private.profile');

  const employeeInfo: { label: string; value?: number | string }[] = [
    {
      label: t('info.academic-degree'),
      value: employeeProfile?.academicDegree,
    },
    {
      label: t('info.academic-status'),
      value: employeeProfile?.academicStatus,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {employeeInfo.map((item, index) => (
        <div key={index} className="flex flex-col gap-3 md:flex-row md:gap-6">
          <Paragraph className="m-0 w-[170px] font-semibold text-neutral-400">{item.label}:</Paragraph>
          <Paragraph className="m-0 font-medium">{item.value}</Paragraph>
        </div>
      ))}

      <Heading6>Перелік посад</Heading6>
      {employeeProfile.positions.map((position, index) => (
        <React.Fragment key={index}>
          <Separator className="" />
          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
            <Paragraph className="m-0 w-[170px] font-semibold text-neutral-400">{t('info.position')}:</Paragraph>
            <Paragraph className="m-0 font-medium">
              {position.name} ({EMPLOYMENT_TYPE[position.employment]})
            </Paragraph>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
            <Paragraph className="m-0 w-[170px] font-semibold text-neutral-400">Підрозділ:</Paragraph>
            <Paragraph className="m-0 font-medium">{position.subdivision.name}</Paragraph>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
