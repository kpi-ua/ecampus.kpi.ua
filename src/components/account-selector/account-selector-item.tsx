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
  state: string;
}

export const AccountSelectorItem = ({ avatarUrl, username, ticketId, state }: AccountSelectorItemProps) => {
  const t = useTranslations('auth.kpi-id');
  const fallbackUsername = capitalize(username.charAt(0));

  return (
    <li className="border-b-neutral-divider flex items-center justify-between border-b py-4 first:pt-0 last:border-none last:pb-0">
      <div className="flex items-center gap-3">
        <Avatar className="size-[48px]">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{fallbackUsername}</AvatarFallback>
        </Avatar>
        <span className="text-neutral-600">{username}</span>
      </div>
      <Button variant="secondary" size="small" className="w-[100px]" asChild>
        {/* No prefetch: the callback spends the one-time ticket and signs the user in, so it must run on the click only. */}
        <Link prefetch={false} href={{ pathname: '/api/kpi-id', query: { username, ticketId, state } }}>
          {t('sign-in')}
        </Link>
      </Button>
    </li>
  );
};
