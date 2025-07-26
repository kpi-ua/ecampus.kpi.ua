'use client';

import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { capitalize } from 'radash';
import Link from 'next/link';

interface AccountSelectorItemProps {
  avatarUrl: string;
  username: string;
  ticketId: string;
}

export const AccountSelectorItem = ({ avatarUrl, username, ticketId }: AccountSelectorItemProps) => {
  const t = useTranslations('auth.kpi-id');
  const fallbackUsername = capitalize(username.charAt(0));

  return (
    <li className="flex items-center justify-between border-b border-b-neutral-divider py-4 first:pt-0 last:border-none last:pb-0">
      <div className="flex items-center gap-3">
        <Avatar className="size-[48px]">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{fallbackUsername}</AvatarFallback>
        </Avatar>
        <span className="text-neutral-600">{username}</span>
      </div>
      <Button variant="secondary" size="small" className="w-[100px]" asChild>
        <Link href={{ pathname: '/api/kpi-id', query: { username, ticketId } }}>{t('sign-in')}</Link>
      </Button>
    </li>
  );
};
