'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserX } from 'lucide-react';
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
import { revokeAllSbpRightsForUser } from '@/actions/sbp-rights.actions';
import { useToast } from '@/hooks/use-toast';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

interface Props {
  userAccountId: number;
  fullName: string;
}

/**
 * Per-user bulk revoke (KB-1336). Soft-deletes every active grant the
 * user holds across every subdivision/year and tears down their
 * RtResponsible rows so the module disappears from their menu.
 * Lives in the group header next to the full name.
 */
export function RevokeAllButton({ userAccountId, fullName }: Props) {
  const t = useTranslations('private.studbonuspointsrights.revokeAll');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await revokeAllSbpRightsForUser(userAccountId);
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
          <UserX className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('description', { user: fullName })}
          </AlertDialogDescription>
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
