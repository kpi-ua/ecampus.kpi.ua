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
import { Paragraph } from '@/components/typography/paragraph';

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
          <AlertDialogDescription>
            {t.rich('codeOfHonor.content', {
              documentsLink: (chunks) => (
                <Link href={process.env.NEXT_PUBLIC_UNIVERSITY_CODE_OF_HONOR_URL!}>{chunks}</Link>
              ),
              paragraph: (chunks) => <Paragraph className="m-0">{chunks}</Paragraph>,
            })}
          </AlertDialogDescription>
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
