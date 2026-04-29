'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteAnnouncement } from '@/actions/announcement.actions';
import { useToast } from '@/hooks/use-toast';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

interface Props {
  /** Announcement id to confirm deletion for. `null` keeps the dialog closed. */
  id: number | null;
  /** Optional title of the entry being deleted; shown in the description. */
  title?: string;
  onClose: () => void;
}

export function DeleteConfirmDialog({ id, title, onClose }: Props) {
  const t = useTranslations('private.announcementseditor.delete');
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();
  const [pending, setPending] = useState(false);

  const open = id !== null;

  const handleConfirm = async () => {
    if (id === null) return;
    setPending(true);
    try {
      await deleteAnnouncement(id);
      toast({ title: t('success') });
      onClose();
    } catch {
      errorToast();
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {title ? t('descriptionWithTitle', { title }) : t('description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            // AlertDialogAction auto-closes the dialog on click; suppress that
            // so the dialog stays open (showing the disabled state) while the
            // async delete is in flight, and let our handler close it on success.
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
            disabled={pending}
          >
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
