'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, useState } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

interface Props {
  /** Message group under `private.studbonuspointsrights` with the dialog copy. */
  messages: 'revoke' | 'revokeAll';
  /** Values interpolated into the dialog description. */
  descriptionValues: Record<string, string>;
  icon: ReactNode;
  onConfirm: () => Promise<void>;
}

/**
 * Destructive confirmation behind a small icon button, shared by the per-row
 * and per-user revoke actions. The description names the target so the
 * SuperAdmin can sanity-check it before clicking through.
 */
export function RevokeDialog({ messages, descriptionValues, icon, onConfirm }: Props) {
  const t = useTranslations(`private.studbonuspointsrights.${messages}`);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();

  const handleConfirm = async () => {
    // Plain useState — useTransition's `isPending` does not span across an
    // `await`, which would let the user double-submit while the request is
    // in-flight.
    setIsSubmitting(true);
    try {
      await onConfirm();
      toast({ title: t('success.title'), description: t('success.description') });
      setOpen(false);
    } catch {
      errorToast();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="tertiary"
          size="small"
          aria-label={t('trigger')}
          className="text-status-danger-300 hover:text-red-700"
        >
          {icon}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description', descriptionValues)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-status-danger-300 hover:bg-red-600 active:border-red-700 active:bg-red-700"
          >
            {t('confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
