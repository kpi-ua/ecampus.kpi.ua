'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { assignGroupLeader, getCuratorStudents } from '@/actions/curator.actions';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

import { CuratorGroup } from '../../types';
import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from './query-keys';

interface Props {
  group: CuratorGroup;
}

export const GroupLeaderSelect = ({ group }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [open, setOpen] = useState(false);
  const [currentLeader, setCurrentLeader] = useState({ id: group.groupLeaderStudentId, name: group.groupLeaderName });
  const studentsQuery = useQuery({
    queryKey: curatorGroupQueryKeys.students(group.groupId),
    queryFn: () => getCuratorStudents(group.groupId),
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const selectedStudent = studentsQuery.data?.find((student) => student.studentId.toString() === studentId);
  const assignment = useMutation({
    mutationFn: (nextStudentId: number) => assignGroupLeader(group.groupId, nextStudentId),
    onSuccess: (_, nextStudentId) => {
      const student = studentsQuery.data?.find((item) => item.studentId === nextStudentId);
      setCurrentLeader({ id: nextStudentId, name: student?.fullName ?? null });
      setStudentId('');
      setOpen(false);
      router.refresh();
      toast({ title: t('leader.success-title'), description: t('leader.success-description') });
    },
    onError: () => errorToast(),
  });

  useEffect(() => {
    setCurrentLeader({ id: group.groupLeaderStudentId, name: group.groupLeaderName });
    setStudentId('');
    setOpen(false);
  }, [group.groupId, group.groupLeaderStudentId, group.groupLeaderName]);

  const isLoading = studentsQuery.isLoading || assignment.isPending;
  const canAssign = !!selectedStudent && selectedStudent.studentId !== currentLeader.id;
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
              <SelectTrigger id={inputId} variant="small" aria-label={t('leader.select')}>
                {isLoading ? (
                  <LoaderCircle className="size-4 animate-spin" aria-label={t('leader.loading')} />
                ) : (
                  <SelectValue placeholder={t('leader.placeholder')} />
                )}
              </SelectTrigger>
              <SelectContent>
                {studentsQuery.data?.map((student) => (
                  <SelectItem key={student.studentId} value={student.studentId.toString()}>
                    {student.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="small" disabled={!canAssign || isLoading} onClick={() => setOpen(true)}>
            {t('leader.assign')}
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!assignment.isPending) setOpen(value);
        }}
      >
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
              <Input id={`${inputId}-next`} value={selectedStudent?.fullName ?? ''} readOnly />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" size="small" disabled={assignment.isPending} onClick={() => setOpen(false)}>
              {t('leader.cancel')}
            </Button>
            <Button
              size="small"
              loading={assignment.isPending}
              disabled={!canAssign}
              onClick={() => {
                if (selectedStudent) assignment.mutate(selectedStudent.studentId);
              }}
            >
              {t('leader.assign')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
