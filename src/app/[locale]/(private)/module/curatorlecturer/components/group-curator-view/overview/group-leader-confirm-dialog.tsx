'use client';

import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useGroupLeaderAssignment } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/overview/hooks/use-group-leader-assignment';
import { CuratorGroup, CuratorStudent } from '@/app/[locale]/(private)/module/curatorlecturer/types';

interface Props {
  group: CuratorGroup;
  student?: CuratorStudent;
  onAssigned: (student: CuratorStudent) => void;
  children: ReactNode;
}

export const GroupLeaderConfirmDialog = ({ group, student, onAssigned, children }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const { open, handleOpenChange, handleAssign, isAssigning, canAssign } = useGroupLeaderAssignment(
    group,
    student,
    onAssigned,
  );
  const inputId = `group-leader-${group.groupId}`;
  const currentName = group.groupLeaderName || t('not-assigned');

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('leader.confirm-title', { group: group.name })}</DialogTitle>
          <DialogDescription>{t('leader.confirm-description')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${inputId}-current`}>{t('leader.now')}</Label>
            <Input id={`${inputId}-current`} value={currentName} readOnly />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${inputId}-next`}>{t('leader.next')}</Label>
            <Input id={`${inputId}-next`} value={student?.fullName ?? ''} readOnly />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" size="small" disabled={isAssigning} onClick={() => handleOpenChange(false)}>
            {t('leader.cancel')}
          </Button>
          <Button size="small" loading={isAssigning} disabled={!canAssign} onClick={handleAssign}>
            {t('leader.assign')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
