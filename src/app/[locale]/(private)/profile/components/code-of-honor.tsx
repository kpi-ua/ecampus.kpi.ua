'use client';

import { Heading6 } from '@/components/typography/headers';
import { Separator } from '@/components/ui/separator';
import { Paragraph } from '@/components/typography/paragraph';
import { User } from '@/types/models/user';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Show } from '@/components/utils/show';

interface Props {
  user: User;
}

export function CodeOfHonor({ user }: Props) {
  const t = useTranslations('private.profile');
  return (
    <div className="flex flex-col gap-3">
      <Heading6>{t('codeOfHonor.title')}</Heading6>
      <Separator />
      {t.rich('codeOfHonor.content', {
        documentsLink: (chunks) => <Link href="/kpi-documents">{chunks}</Link>,
        paragraph: (chunks) => <Paragraph className="m-0 text-lg">{chunks}</Paragraph>,
      })}
      <Show when={!!user.codeOfHonorSignDate}>
        <div className="flex flex-col gap-1">
          <Paragraph>{t('codeOfHonor.agreement')}</Paragraph>
          <Paragraph className="m-0">{user.codeOfHonorSignDate}</Paragraph>
        </div>
      </Show>
    </div>
  );
}
