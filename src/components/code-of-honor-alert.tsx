'use client';

import { useTranslations } from 'next-intl';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import React from 'react';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import { acceptCodeOfHonor } from '@/actions/profile.actions';
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
import { Link } from '@/i18n/routing';
import { Paragraph } from '@/components/typography/paragraph';

export default function CodeOfHonorAlert() {
  const t = useTranslations('private.profile');

  const { errorToast } = useServerErrorToast();

  const [, setUser] = useLocalStorage<User>('user');

  const handleAcceptCodeOfHonor = async () => {
    const res = await acceptCodeOfHonor();

    if (!res) {
      errorToast();
      return;
    }
    setUser(res);
  };

  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent closable={false}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('codeOfHonor.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.rich('codeOfHonor.content', {
              documentsLink: (chunks) => <Link href="/kpi-documents">{chunks}</Link>,
              paragraph: (chunks) => <Paragraph className="m-0">{chunks}</Paragraph>,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link href="/">
            <AlertDialogCancel>На головну</AlertDialogCancel>
          </Link>
          <AlertDialogAction onClick={handleAcceptCodeOfHonor}>{t('button.agree')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
