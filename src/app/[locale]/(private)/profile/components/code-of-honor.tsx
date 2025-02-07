'use client';

import { Heading6 } from '@/components/typography/headers';
import { Separator } from '@/components/ui/separator';
import { Paragraph } from '@/components/typography/paragraph';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function CodeOfHonor() {
  const t = useTranslations('private.profile');
  const [user] = useLocalStorage<User>('user');
  return (
    <div className="flex flex-col gap-3">
      <Heading6>{t('codeOfHonor.title')}</Heading6>
      <Separator />
      {t.rich('codeOfHonor.content', {
        documentsLink: (chunks) => <Link href="/kpi-documents">{chunks}</Link>,
        paragraph: (chunks) => <Paragraph className="m-0 text-lg">{chunks}</Paragraph>,
      })}
      {user?.codeOfHonorSignDate && (
        <div className="flex flex-col gap-1">
          <Paragraph>{t('codeOfHonor.agreement')}</Paragraph>
          <Paragraph className="m-0">{user?.codeOfHonorSignDate}</Paragraph>
        </div>
      )}
    </div>
  );
}
