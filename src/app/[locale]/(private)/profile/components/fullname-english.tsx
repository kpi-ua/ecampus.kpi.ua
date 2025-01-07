import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heading6 } from '@/components/typography/headers';
import { PencilBold } from '@/app/images';
import { Show } from '@/components/utils/show';

interface Props {
  fullNameEnglish: string;
  onSave: (newName: string) => void;
}

export function FullNameEnglish({ fullNameEnglish, onSave }: Props) {
  const t = useTranslations('private.profile');
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(fullNameEnglish);

  const handleSave = async () => {
    onSave(inputValue);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-wrap gap-2 md:flex-nowrap">
      <Show
        when={isEditing || !fullNameEnglish}
        fallback={
          <>
            <Heading6>{fullNameEnglish}</Heading6>
            <PencilBold className="h-6 w-6 cursor-pointer text-basic-blue" onClick={() => setIsEditing(true)} />
          </>
        }
      >
        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={t('info.fullNameEN')} />
        <Button onClick={handleSave}>{t('button.save')}</Button>
      </Show>
    </div>
  );
}
