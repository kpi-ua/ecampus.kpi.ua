'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { acceptPrivacyConsent } from '@/actions/profile.actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

export function PrivacyConsentDialog() {
  const t = useTranslations('private.privacy-consent');
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(true);

  const { errorToast } = useServerErrorToast();

  const handleAccept = async () => {
    setIsPending(true);
    try {
      await acceptPrivacyConsent();
      setOpen(false);
    } catch (error) {
      errorToast();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-2xl"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">{t('title')}</DialogTitle>
          <DialogDescription className="sr-only">{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 text-sm text-foreground">
          <p>{t('agreement-intro')}</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t('data-items.name')}</li>
            <li>{t('data-items.education')}</li>
            <li>{t('data-items.media')}</li>
            <li>{t('data-items.works')}</li>
            <li>{t('data-items.other')}</li>
          </ul>
          <p>{t('responsibility')}</p>
          <p>{t('revocation')}</p>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} loading={isPending} disabled={isPending} className="w-full sm:w-auto min-w-[120px]">
            {t('accept-button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
