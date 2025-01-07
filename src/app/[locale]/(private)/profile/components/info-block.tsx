'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProfilePicture } from '@/app/[locale]/(private)/profile-picture';
import { useLocalStorage } from '@/hooks/use-storage';
import { Heading4, Heading6 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { updateEnglishFullName } from '@/actions/profile.actions';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PencilBold } from '@/app/images';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Paragraph } from '@/components/typography/paragraph';
import { User } from '@/types/user';
import { EMPLOYMENT_TYPE, USER_CATEGORIES } from '@/types/constants';
import React from 'react';

interface Props {
  className?: string;
}

export function InfoBlock({ className }: Props) {
  const [user, setUser] = useLocalStorage<User>('user');

  const t = useTranslations('private.profile');

  const [isEditing, setIsEditing] = useState(false);
  const [fullNameEn, setFullNameEn] = useState(user?.fullNameEnglish || '');

  const { errorToast } = useServerErrorToast();

  const studentProfile = user?.studentProfile;
  const employeeProfile = user?.employeeProfile;

  const handleSave = async () => {
    const res = await updateEnglishFullName(fullNameEn);
    setIsEditing(false);
    if (!res) {
      errorToast();
      return;
    }
    setUser(res);
  };

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
    <Card className={cn(className)}>
      <CardContent className="flex flex-col gap-6 space-y-1.5 p-9">
        <div className="flex flex-col gap-6 md:flex-row">
          <ProfilePicture />
          <div className="flex flex-col gap-4 md:gap-2">
            <Heading4>{user?.fullName}</Heading4>
            <div className="flex flex-wrap gap-2 md:flex-nowrap">
              {isEditing || !user?.fullNameEnglish ? (
                <>
                  <Input
                    value={fullNameEn}
                    onChange={(e) => setFullNameEn(e.target.value)}
                    placeholder={t('info.fullNameEN')}
                  />
                  <Button onClick={handleSave}>{t('button.save')}</Button>
                </>
              ) : (
                <>
                  <Heading6>{user?.fullNameEnglish}</Heading6>
                  <PencilBold className="h-6 w-6 cursor-pointer text-basic-blue" onClick={() => setIsEditing(true)} />
                </>
              )}
            </div>
            <div className="flex gap-2">
              {user?.userCategories.map((category) => (
                <Heading6 key={category} className="text-basic-blue">
                  {USER_CATEGORIES[category]}
                </Heading6>
              ))}
              {studentProfile?.status && <Badge className="text-other-blue">{studentProfile?.status}</Badge>}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <Heading6>{user?.employeeProfile ? t('info.work-title') : t('info.education-title')}</Heading6>
          <Separator className="my-3" />
          {studentProfile && (
            <div className="flex flex-col gap-4">
              {studentInfo.map((item, index) => (
                <div key={index} className="flex flex-col gap-3 md:flex-row md:gap-6">
                  <Paragraph className="m-0 w-[170px] font-semibold text-neutral-400">{item.label}:</Paragraph>
                  <Paragraph className="m-0 font-medium">{item.value}</Paragraph>
                </div>
              ))}
            </div>
          )}

          {employeeProfile && (
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
                    <Paragraph className="m-0 w-[170px] font-semibold text-neutral-400">Посада:</Paragraph>
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
