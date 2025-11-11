'use client';

import { useTranslations } from 'next-intl';
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
import RichText from '@/components/typography/rich-text';

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
          <RichText>
            {(tags) =>
              t.rich('codeOfHonor.content', {
                ...tags,
                documentsLink: (chunks) => (
                  <Link target="_blank" href={process.env.NEXT_PUBLIC_CODE_OF_HONOR!}>
                    {chunks}
                  </Link>
                ),
                paragraph: (chunks) => (
                  <AlertDialogDescription className="leading-lg m-0 my-4 text-lg">{chunks}</AlertDialogDescription>
                ),
              })
            }
          </RichText>
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
