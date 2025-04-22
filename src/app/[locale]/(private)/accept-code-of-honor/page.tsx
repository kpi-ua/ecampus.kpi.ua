'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { acceptCodeOfHonor } from '@/actions/profile.actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Link } from '@/i18n/routing';

export default function CodeOfHonorAlert() {
  const t = useTranslations('private.profile');

  const handleAcceptCodeOfHonor = async () => {
    await acceptCodeOfHonor();
  };

  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent className="w-[340px] rounded-[12px] sm:w-full" closable={false}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('codeOfHonor.title')}</AlertDialogTitle>
          {t.rich('codeOfHonor.content', {
            documentsLink: (chunks) => (
              <Link href={process.env.NEXT_PUBLIC_UNIVERSITY_CODE_OF_HONOR_URL!}>{chunks}</Link>
            ),
            paragraph: (chunks) => (
              <AlertDialogDescription className="m-0 my-4 text-lg leading-lg">{chunks}</AlertDialogDescription>
            ),
          })}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="w-full md:w-fit" onClick={handleAcceptCodeOfHonor}>
            {t('button.agree')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
