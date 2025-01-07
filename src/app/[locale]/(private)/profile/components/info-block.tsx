'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-storage';
import { Heading4, Heading6 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { updateEnglishFullName } from '@/actions/profile.actions';
import { Badge } from '@/components/ui/badge';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { User } from '@/types/user';
import { USER_CATEGORIES } from '@/types/constants';
import React from 'react';
import { FullNameEnglish } from '@/app/[locale]/(private)/profile/components/fullname-english';
import { LecturerInfo } from '@/app/[locale]/(private)/profile/components/lecturer-info';
import { StudentInfo } from '@/app/[locale]/(private)/profile/components/student-info';
import { ProfilePicture } from '@/components/ui/profile-picture';

interface Props {
  className?: string;
}

export function InfoBlock({ className }: Props) {
  const [user, setUser] = useLocalStorage<User>('user');

  const t = useTranslations('private.profile');

  const { errorToast } = useServerErrorToast();

  const studentProfile = user?.studentProfile;
  const employeeProfile = user?.employeeProfile;

  const handleSaveFullNameEn = async (newName: string) => {
    const res = await updateEnglishFullName(newName);
    if (!res) {
      errorToast();
      return;
    }
    setUser(res);
  };

  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col gap-6 space-y-1.5 p-9">
        <div className="flex flex-col gap-6 md:flex-row">
          <ProfilePicture size="xl" src={user?.photo || ''} />
          <div className="flex flex-col gap-4 md:gap-2">
            <Heading4>{user?.fullName}</Heading4>
            <FullNameEnglish fullNameEnglish={user?.fullNameEnglish || ''} onSave={handleSaveFullNameEn} />
            <div className="flex gap-2">
              {user?.userCategories.map((category) => (
                <Heading6 key={category} className="text-basic-blue">
                  {USER_CATEGORIES[category]}
                </Heading6>
              ))}
              {studentProfile?.status && <Badge className="text-other-blue">{studentProfile.status}</Badge>}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <Heading6>{employeeProfile ? t('info.work-title') : t('info.education-title')}</Heading6>
          <Separator className="my-3" />
          {studentProfile && <StudentInfo studentProfile={studentProfile} />}
          {employeeProfile && <LecturerInfo employeeProfile={employeeProfile} />}
        </div>
      </CardContent>
    </Card>
  );
}
