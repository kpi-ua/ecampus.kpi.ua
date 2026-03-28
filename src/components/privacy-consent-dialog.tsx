'use client';

import React, { useState } from 'react';
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
          <DialogTitle className="text-xl">Згода на розміщення персональних даних КПІ в мережі Інтернет</DialogTitle>
          <DialogDescription className="sr-only">
            Угода про використання персональних даних на порталі Інтелект.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 text-sm text-foreground">
          <p>Я надаю згоду на публікацію на порталі Інтелект таких персональних даних:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Прізвище, ім’я</li>
            <li>Освіта (заклад)</li>
            <li>Матеріали фото- й відеозйомки, здійснених під час занять, місце роботи</li>
            <li>Публікація творчих робіт</li>
            <li>Інші відомості: дані оцінювання НПП</li>
          </ul>
          <p>
            Я розумію відповідальність і можливі негативні наслідки прийнятого рішення, зокрема у разі неправомірного
            використання цих даних третіми особами.
          </p>
          <p>Згода надається безстроково та може бути відкликана в будь-який час шляхом подання письмової заяви.</p>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} loading={isPending} disabled={isPending} className="w-full sm:w-auto min-w-[120px]">
            Надаю згоду
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
