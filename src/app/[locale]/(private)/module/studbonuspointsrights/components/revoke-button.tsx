'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
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
import { revokeSbpRight } from '@/actions/sbp-rights.actions';
import { useToast } from '@/hooks/use-toast';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { SbpResponsibilityListItem } from '@/types/models/sbp-rights';

interface Props {
  item: SbpResponsibilityListItem;
}

/**
 * Per-row revoke action. Wraps a destructive AlertDialog around a small
 * trash-icon button. Confirmation copy includes the user, point and
 * subdivision so the SuperAdmin can sanity-check the target before clicking
 * through.
 */
export function RevokeButton({ item }: Props) {
  const t = useTranslations('private.studbonuspointsrights.revoke');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await revokeSbpRight(item.id);
        toast({ title: t('success.title'), description: t('success.description') });
        setOpen(false);
      } catch {
        errorToast();
      }
    });
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
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('description', {
              user: item.fullName,
              load: item.loadName,
              subdivision: item.subdivisionAbbreviation ?? item.subdivisionName,
              year: item.studyingYearName,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-status-danger-300 hover:bg-red-600 active:border-red-700 active:bg-red-700"
          >
            {t('confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
