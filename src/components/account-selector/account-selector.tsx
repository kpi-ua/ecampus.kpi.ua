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
    <ul className={cn('border-l-neutral-divider list-none rounded-lg border p-4', className)}>
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
