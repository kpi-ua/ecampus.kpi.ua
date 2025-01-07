import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilBold, XBold } from '@/app/images';
import { useTranslations } from 'next-intl';
import { Paragraph } from '@/components/typography/paragraph';
import { Show } from '@/components/utils/show';

interface Props {
  onSave: (newValue: string) => void;
  onDelete: () => void;
  value?: string;
  label?: string;
}

export function ContactEditor({ label, value, onSave, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(!value);
  const [currentValue, setCurrentValue] = useState(value);

  const t = useTranslations('private.profile');

  const handleSave = () => {
    onSave(currentValue || '');
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-start gap-4 xl:flex-row xl:items-center">
      <Show when={!!label}>
        <Paragraph className="m-0 w-[170px] font-semibold text-neutral-400">{label}:</Paragraph>
      </Show>

      {isEditing ? (
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          <Input
            className="w-full min-w-[170px] md:w-[340px]"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
          <Button onClick={handleSave}>{t('button.save')}</Button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-between gap-4 md:flex-nowrap">
          <Paragraph className="m-0 font-medium">{value}</Paragraph>
          <div className="flex w-14 gap-2">
            <PencilBold className="size-6 cursor-pointer text-basic-blue" onClick={() => setIsEditing(true)} />
            <XBold className="size-6 cursor-pointer text-status-danger-300" onClick={onDelete} />
          </div>
        </div>
      )}
    </div>
  );
}
