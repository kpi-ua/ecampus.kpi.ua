import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { dash } from 'radash';

import { LecturerInfo } from '@/app/[locale]/(private)/profile/components/lecturer-info';
import { StudentInfo } from '@/app/[locale]/(private)/profile/components/student-info';
import { Heading4, Heading6 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Separator } from '@/components/ui/separator';
import { USER_CATEGORIES } from '@/lib/constants/common';
import { cn } from '@/lib/utils';
import { User } from '@/types/models/user';

interface Props {
  user: User;
  className?: string;
}

export async function InfoBlock({ user, className }: Props) {
  const t = await getTranslations('private.profile');
  const tUserCategory = await getTranslations('global.user-category');
  const tEnums = await getTranslations('global.enums');

  const studentProfile = user?.studentProfile;
  const employeeProfile = user?.employeeProfile;

  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col gap-6 space-y-1.5 p-9">
        <div className="flex w-full flex-col gap-6 md:flex-row">
          <ProfilePicture size="xl" src={user.photo || ''} />
          <div className="flex flex-col gap-3 md:gap-2">
            <div className="flex flex-col gap-1">
              <Heading4>{user.fullName}</Heading4>
              <Paragraph className="m-0 text-base text-muted-foreground">{user.username}</Paragraph>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {user.userCategories.map((category) => (
                <Badge key={category} variant="blue" className="whitespace-nowrap">
                  {tUserCategory(USER_CATEGORIES[category])}
                </Badge>
              ))}
              {studentProfile?.status && (
                <Badge className="whitespace-nowrap">{tEnums(`student-status.${dash(studentProfile.status)}`)}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <Heading6>{employeeProfile ? t('info.work-title') : t('info.education-title')}</Heading6>
          <Separator className="my-3" />
          {studentProfile && <StudentInfo studentProfile={studentProfile} />}
          {employeeProfile && <LecturerInfo employeeProfile={employeeProfile} />}
        </div>

        {user.intellectProfile && (
          <Link
            className="text-lg font-semibold text-basic-blue hover:underline"
            href={user.intellectProfile}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('info.intellect-profile')}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
