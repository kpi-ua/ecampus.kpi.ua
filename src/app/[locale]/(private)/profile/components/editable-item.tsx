import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilBold, XBold } from '@/app/images';
import { useTranslations } from 'next-intl';
import { Paragraph } from '@/components/typography/paragraph';

interface Props {
  onSave: (newValue: string) => void;
  value?: string;
  label?: string;
  onDelete?: () => void;
}

export function EditableItem({ label, value, onSave, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(!value);
  const [currentValue, setCurrentValue] = useState(value);

  const t = useTranslations('private.profile');

  const handleSave = () => {
    onSave(currentValue || '');
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-start gap-4 xl:flex-row xl:items-center">
      {label && <Paragraph className="m-0 w-[170px] font-semibold text-neutral-400">{label}:</Paragraph>}

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
        <div className="flex justify-between gap-4">
          <Paragraph className="m-0 font-medium">{value}</Paragraph>
          <PencilBold className="h-6 w-6 cursor-pointer text-basic-blue" onClick={() => setIsEditing(true)} />
          <XBold className="h-6 w-6 cursor-pointer text-status-danger-300" onClick={onDelete} />
        </div>
      )}
    </div>
  );
}
