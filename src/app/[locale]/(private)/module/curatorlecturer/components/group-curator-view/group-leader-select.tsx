'use client';

import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Show } from '@/components/utils/show';

import { useGroupLeaderSelect } from './hooks/overview-tab/use-group-leader-select';
import { CuratorGroup } from '../../types';
import { GroupLeaderConfirmDialog } from './group-leader-confirm-dialog';

interface Props {
  group: CuratorGroup;
}

export const GroupLeaderSelect = ({ group }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const { studentId, setStudentId, currentLeader, selectedStudent, handleAssigned, students, isLoading, canAssign } =
    useGroupLeaderSelect(group);
  const currentName = currentLeader.name || t('not-assigned');
  const inputId = `group-leader-${group.groupId}`;

  return (
    <>
      <div className="border-neutral-divider flex flex-col gap-6 rounded-lg border p-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Paragraph className="m-0 text-sm">{t('leader.current')}</Paragraph>
          <Paragraph className="m-0 mt-1 font-semibold">{currentName}</Paragraph>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end md:flex-1">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Label htmlFor={inputId} className="text-sm text-neutral-500">
              {t('leader.new')}
            </Label>
            <Select value={studentId} onValueChange={setStudentId} disabled={isLoading}>
              <SelectTrigger id={inputId} variant="small">
                <Show when={isLoading} fallback={<SelectValue placeholder={t('leader.placeholder')} />}>
                  <LoaderCircle className="size-4 animate-spin" />
                </Show>
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.studentId} value={student.studentId.toString()}>
                    {student.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <GroupLeaderConfirmDialog
            group={{ ...group, groupLeaderStudentId: currentLeader.id, groupLeaderName: currentLeader.name }}
            student={selectedStudent}
            onAssigned={handleAssigned}
          >
            <Button size="small" disabled={!canAssign || isLoading}>
              {t('leader.assign')}
            </Button>
          </GroupLeaderConfirmDialog>
        </div>
      </div>
    </>
  );
};
