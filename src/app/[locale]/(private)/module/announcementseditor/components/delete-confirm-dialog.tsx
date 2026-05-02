'use client';

import { useTranslations } from 'next-intl';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog = ({ title, onClose, onConfirm }: Props) => {
  const t = useTranslations('private.announcementseditor.delete');
  return (
    <AlertDialog
      defaultOpen={true}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('description', { title })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button variant="primary" onClick={onConfirm}>
            {t('confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
