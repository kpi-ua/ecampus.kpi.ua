'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { capitalize } from 'radash';

import { KPIID_LOGIN_PATH } from '@/proxy/contants';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

interface AccountSelectorItemProps {
  avatarUrl: string;
  username: string;
}

export const AccountSelectorItem = ({ avatarUrl, username }: AccountSelectorItemProps) => {
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
        {/* Not prefetched: following the link starts a sign-in */}
        <Link href={{ pathname: KPIID_LOGIN_PATH, query: { username } }} prefetch={false}>
          {t('sign-in')}
        </Link>
      </Button>
    </li>
  );
};
