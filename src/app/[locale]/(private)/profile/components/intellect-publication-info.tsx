'use client';

import { useState } from 'react';
import { Heading6 } from '@/components/typography/headers';
import { Separator } from '@/components/ui/separator';
import { Paragraph } from '@/components/typography/paragraph';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import { updateIntellectInfo } from '@/actions/profile.actions';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useTranslations } from 'next-intl';
import { Show } from '@/components/utils/show';

export function IntellectPublicationInfo() {
  const isMobile = useIsMobile();

  const [user, setUser] = useLocalStorage<User>('user');

  const { errorToast } = useServerErrorToast();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [credo, setCredo] = useState(user?.credo || '');
  const [scientificInterests, setScientificInterests] = useState(user?.scientificInterests || '');

  const t = useTranslations('private.profile');

  const handleSave = async () => {
    setLoading(true);
    const res = await updateIntellectInfo(credo, scientificInterests);
    setLoading(false);
    setIsEditing(false);
    if (!res) {
      errorToast();
      return;
    }
    setUser(res);
  };

  return (
    <div className="flex flex-col gap-3">
      <Heading6>{t('intellect.info-title')}</Heading6>
      <Separator />

      <div className="flex flex-col gap-1">
        <label className="text-base font-semibold text-neutral-600">{t('intellect.credo')}</label>
        <Show
          when={isEditing}
          fallback={<Paragraph className="m-0 text-lg font-medium">{credo || 'Не вказано'}</Paragraph>}
        >
          <Input
            className="w-full"
            value={credo}
            onChange={(e) => setCredo(e.target.value)}
            placeholder="Введіть улюблену цитату"
          />
        </Show>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-base font-semibold text-neutral-600">{t('intellect.scientificInterests')}</label>
        <Show
          when={isEditing}
          fallback={<Paragraph className="m-0 text-lg font-medium">{scientificInterests || 'Не вказано'}</Paragraph>}
        >
          <Input
            className="w-full"
            value={scientificInterests}
            onChange={(e) => setScientificInterests(e.target.value)}
            placeholder="Введіть напрями досліджень"
          />
        </Show>
      </div>

      <div className="flex justify-end">
        <Button
          className="w-fit"
          loading={loading}
          variant={isEditing ? 'primary' : 'secondary'}
          size={isMobile ? 'medium' : 'big'}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? t('button.save') : t('button.edit')}
        </Button>
      </div>
    </div>
  );
}
