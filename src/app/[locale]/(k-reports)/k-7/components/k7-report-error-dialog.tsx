'use client';

import { useTranslations } from 'next-intl';
import { XIcon } from 'lucide-react';

import { Warning } from '@/app/images';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const K7ReportErrorDialog = ({ open, onOpenChange }: Props) => {
  const t = useTranslations('private.k-reports.k-7.errorDialog');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[410px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] border-0 p-6"
        overlayClassName="bg-black/10"
        showCloseButton={false}
      >
        <DialogHeader className="gap-3">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="leading-lg flex items-center gap-2 text-left text-lg font-semibold">
              <Warning className="text-status-danger-300 size-5 shrink-0" />
              {t('title')}
            </DialogTitle>
            <DialogClose className="shrink-0 text-neutral-500 transition-colors hover:text-neutral-900">
              <XIcon className="size-5" />
              <span className="sr-only">{t('close')}</span>
            </DialogClose>
          </div>
          <DialogDescription className="leading-base text-left text-base text-neutral-600">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 grid grid-cols-2 gap-3 sm:grid sm:grid-cols-2">
          <DialogClose asChild>
            <Button variant="secondary" size="medium" className="h-11 w-full rounded-[8px] py-0">
              {t('close')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size="medium" className="h-11 w-full rounded-[8px] py-0">
              {t('retry')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
