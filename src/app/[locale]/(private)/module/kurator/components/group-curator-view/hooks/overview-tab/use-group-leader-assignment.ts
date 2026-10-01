'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { assignGroupLeader } from '@/actions/curator.actions';
import { CuratorGroup, CuratorStudent } from '@/app/[locale]/(private)/module/kurator/types';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

export const useGroupLeaderAssignment = (
  group: CuratorGroup,
  student: CuratorStudent | undefined,
  onAssigned: (student: CuratorStudent) => void,
) => {
  const t = useTranslations('private.curator.lecturer.group-curator');

  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const assignment = useMutation({
    mutationFn: (nextStudent: CuratorStudent) => assignGroupLeader(group.groupId, nextStudent.studentId),
    onSuccess: (_, nextStudent) => {
      setOpen(false);
      onAssigned(nextStudent);
      router.refresh();
      toast({ title: t('leader.success-title'), description: t('leader.success-description') });
    },
    onError: () => errorToast(),
  });

  useEffect(() => {
    setOpen(false);
  }, [group.groupId]);

  const handleOpenChange = (value: boolean) => {
    if (assignment.isPending) {
      return;
    }

    setOpen(value);
  };

  const canAssign = !!student && student.studentId !== group.groupLeaderStudentId;

  const handleAssign = () => {
    if (student && canAssign && !assignment.isPending) {
      assignment.mutate(student);
    }
  };

  return { open, handleOpenChange, handleAssign, isAssigning: assignment.isPending, canAssign };
};
