import { FC, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilBold, XBold } from '@/app/images';
import { useTranslations } from 'next-intl';

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
    <div className="flex items-center gap-4">
      {label && <span className="w-[170px] font-semibold text-neutral-400">{label}:</span>}

      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input className="w-[340px]" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
          <Button onClick={handleSave}>{t('button.save')}</Button>
        </div>
      ) : (
        <>
          <span className="font-medium">{value}</span>
          <PencilBold className="h-6 w-6 cursor-pointer text-basic-blue" onClick={() => setIsEditing(true)} />
          {onDelete && <XBold className="h-6 w-6 cursor-pointer text-status-danger-300" onClick={onDelete} />}
        </>
      )}
    </div>
  );
}
