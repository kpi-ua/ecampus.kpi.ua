'use client';

import { cn } from '@/lib/utils';
import { KPIIDAccountSlim } from '@/types/models/kpi-id-account';

import { AccountSelectorItem } from './account-selector-item';

interface AccountSelectorProps {
  accounts: KPIIDAccountSlim[];
  className?: string;
}

export const AccountSelector = ({ accounts, className }: AccountSelectorProps) => {
  return (
    <ul className={cn('border-l-neutral-divider list-none rounded-lg border p-4', className)}>
      {accounts.map((account) => (
        <AccountSelectorItem key={account.username} avatarUrl={account.photo} username={account.username} />
      ))}
    </ul>
  );
};
