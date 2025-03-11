'use client';

import { cn } from '@/lib/utils';
import { AccountSelectorItem } from './account-selector-item';
import { KPIIDAccountSlim } from '@/types/models/kpi-id-account';

interface AccountSelectorProps {
  accounts: KPIIDAccountSlim[];
  ticketId: string;
  className?: string;
}

export const AccountSelector = ({ accounts, ticketId, className }: AccountSelectorProps) => {
  return (
    <ul className={cn('list-none rounded-lg border-[1px] border-l-neutral-divider p-4', className)}>
      {accounts.map((account) => (
        <AccountSelectorItem
          key={account.username}
          avatarUrl={account.photo}
          username={account.username}
          ticketId={ticketId}
        />
      ))}
    </ul>
  );
};
