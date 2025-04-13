'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Heading4, Heading6 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/models/user';
import { USER_CATEGORIES } from '@/lib/constants/user-category';
import React from 'react';
import { LecturerInfo } from '@/app/[locale]/(private)/profile/components/lecturer-info';
import { StudentInfo } from '@/app/[locale]/(private)/profile/components/student-info';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { EditableField } from '@/app/[locale]/(private)/profile/components/editable-field';

interface Props {
  user: User;
  className?: string;
}

export function InfoBlock({ user, className }: Props) {
  const t = useTranslations('private.profile');
  const tUserCategory = useTranslations('global.user-category');

  const studentProfile = user?.studentProfile;
  const employeeProfile = user?.employeeProfile;

  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col gap-6 space-y-1.5 p-9">
        <div className="flex w-full flex-col gap-6 md:flex-row">
          <ProfilePicture size="xl" src={user.photo || ''} />
          <div className="flex flex-col gap-4 md:gap-2">
            <Heading4>{user.fullName}</Heading4>
            <div className="flex gap-2">
              {user.userCategories.map((category) => (
                <Heading6 key={category} className="text-basic-blue">
                  {tUserCategory(USER_CATEGORIES[category])}
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
