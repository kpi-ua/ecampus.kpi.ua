'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProfilePicture } from '@/app/[locale]/(private)/profile-picture';
import { useLocalStorage } from '@/hooks/use-storage';
import { User, USER_CATEGORIES } from '@/types/user';
import { Heading4, Heading6 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { EditableItem } from '@/app/[locale]/(private)/profile/components/EditableItem';
import { updateEnglishFullName } from '@/actions/profile.actions';
import { getUserDetails } from '@/actions/auth.actions';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PencilBold } from '@/app/images';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

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

  const handleSave = async () => {
    const res = await updateEnglishFullName(fullNameEn);
    setIsEditing(false);
    if (!res) {
      errorToast();
      return;
    }
    setUser(res);
  };

  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col gap-6 space-y-1.5 p-9">
        <div className="flex gap-6">
          <ProfilePicture />
          <div className="flex flex-col gap-2">
            <Heading4>{user?.fullName}</Heading4>
            <div className="flex gap-2">
              {isEditing || !user?.fullNameEnglish ? (
                <>
                  <Input
                    className="w-[340px]"
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
          <Heading6>{t('info.title')}</Heading6>
          <Separator className="my-3" />
          {studentProfile && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-6">
                <span className="w-[170px] font-semibold text-neutral-400">{t('info.subdivision')}:</span>
                <span className="font-medium">{studentProfile?.faculty}</span>
              </div>
              <div className="flex gap-6">
                <span className="w-[170px] font-semibold text-neutral-400">{t('info.group')}:</span>
                <span className="font-medium">{studentProfile?.studyGroup?.name}</span>
              </div>
              <div className="flex gap-6">
                <span className="w-[170px] font-semibold text-neutral-400">{t('info.study-form')}:</span>
                <span className="font-medium">{studentProfile?.formOfEducation}</span>
              </div>
              <div className="flex gap-6">
                <span className="w-[170px] font-semibold text-neutral-400">{t('info.course')}:</span>
                <span className="font-medium">{studentProfile?.studyYear}</span>
              </div>
              <div className="flex gap-6">
                <span className="w-[170px] font-semibold text-neutral-400">{t('info.specialty')}:</span>
                <span className="font-medium">{studentProfile?.speciality}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
