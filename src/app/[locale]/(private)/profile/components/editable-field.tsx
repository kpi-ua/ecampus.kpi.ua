import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paragraph } from '@/components/typography/paragraph';
import { PencilBold, XBold } from '@/app/images';
import { Show } from '@/components/utils/show';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Heading6 } from '@/components/typography/headers';

interface EditableFieldProps {
  onSave: (newValue: string) => void;
  size?: 'small' | 'medium';
  value?: string;
  onDelete?: () => void;
  label?: string;
  renderValue?: (value: string) => React.ReactNode;
  disableClearValue?: boolean;
  placeholder?: string;
}

export function EditableField({
  onSave,
  value,
  size = 'medium',
  onDelete,
  label,
  renderValue,
  disableClearValue = false,
  placeholder,
}: EditableFieldProps) {
  const t = useTranslations('private.profile');
  const tTooltip = useTranslations('global.tooltip');
  const [isEditing, setIsEditing] = useState(!value);
  const [currentValue, setCurrentValue] = useState(value || '');

  useEffect(() => {
    if (!value) {
      setIsEditing(true);
    }
  }, [value]);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="group flex flex-col items-start gap-4 xl:flex-row xl:items-center">
      <Show when={!!label}>
        <Paragraph className="m-0 w-full min-w-[170px] max-w-[250px] font-semibold text-neutral-400">
          {label}:
        </Paragraph>
      </Show>

      {isEditing ? (
        <div className="flex w-full flex-wrap items-center gap-2 md:flex-nowrap">
          <Input
            size={size}
            className="text-lg font-medium text-neutral-900"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={placeholder}
          />
          <Button size={size} onClick={handleSave}>
            {t('button.save')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-between gap-4 md:flex-nowrap">
          {renderValue ? renderValue(currentValue) : <Paragraph className="m-0 font-medium">{currentValue}</Paragraph>}
          <div className="flex gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="tertiary"
                    className="size-6"
                    icon={<PencilBold className="text-basic-blue" />}
                    onClick={() => setIsEditing(true)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tTooltip('edit')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!disableClearValue && onDelete && (
              <AlertDialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="tertiary"
                          className="size-6"
                          icon={<XBold className="text-status-danger-300" />}
                        />
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tTooltip('delete')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <AlertDialogContent className="max-w-[400px] rounded-[12px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <Heading6>{t('contact.delete-dialog-title')}</Heading6>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base font-medium">
                      {t('contact.delete-dialog-description')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex h-[44px] gap-4">
                    <AlertDialogCancel className="h-[44px] w-full">
                      {t('contact.delete-dialog-cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction className="h-[44px] w-full" onClick={handleDelete}>
                      {t('contact.delete-dialog-confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
