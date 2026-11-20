'use client';

import { useTranslations } from 'next-intl';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function StudentGroupConfirm({
  action,
  student,
  pending,
  onConfirm,
}: {
  action: 'assign' | 'remove';
  student: string;
  pending: boolean;
  onConfirm: () => void;
}) {
  const t = useTranslations('private.ekanat');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="secondary" loading={pending} disabled={pending}>
          {t(action)}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent closable={false} aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(action === 'assign' ? 'confirmAssign' : 'confirmRemove', { student })}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{t(action)}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
