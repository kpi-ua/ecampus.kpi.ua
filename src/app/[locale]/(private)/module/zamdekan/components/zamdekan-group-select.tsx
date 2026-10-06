'use client';

import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from '@/i18n/routing';

import { ZamdekanGroup } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  groups: ZamdekanGroup[];
  groupId?: number;
}

export const ZamdekanGroupSelect = ({ groups, groupId }: Props) => {
  const t = useTranslations('private.zamdekan');
  const router = useRouter();

  return (
    <div className="w-full space-y-2 sm:max-w-sm">
      <Label htmlFor="agreement-group">{t('columns.group')}</Label>
      <Select
        value={groupId === undefined ? '' : String(groupId)}
        disabled={groups.length === 0}
        onValueChange={(value) => router.push(getZamdekanReportPath({ view: 'agreements', groupId: Number(value) }))}
      >
        <SelectTrigger id="agreement-group">
          <SelectValue placeholder={t('select-group')} />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.groupId} value={String(group.groupId)}>
              {group.group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
