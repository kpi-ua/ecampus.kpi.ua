'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { assignGroupCurator, updateCuratorAssignmentDates } from '@/actions/curatorlecturer.actions';
import { curatorAdministrationQueryKeys } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/query-keys';
import { CuratorGroup } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

interface AssignmentValues {
  assignmentId?: number;
  employeeId: number;
  startDate: string;
  endDate: string;
}

export const useCuratorAssignment = (group: CuratorGroup) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const assignment = useMutation({
    mutationFn: ({ assignmentId, employeeId, startDate, endDate }: AssignmentValues) =>
      assignmentId !== undefined
        ? updateCuratorAssignmentDates(group.groupId, assignmentId, startDate, endDate)
        : assignGroupCurator(group.groupId, employeeId, startDate, endDate),
    onSuccess: async (result, { startDate, endDate }) => {
      if (result !== 'assigned') {
        toast({
          title: t(`validation.${result}`),
          variant: 'destructive',
        });
        await queryClient.invalidateQueries({ queryKey: curatorAdministrationQueryKeys.assignments(group.groupId) });
        return;
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: curatorAdministrationQueryKeys.groups }),
        queryClient.invalidateQueries({ queryKey: curatorAdministrationQueryKeys.assignments(group.groupId) }),
      ]);
      toast({
        title: t('success.title'),
        description: t('success.description', {
          group: group.name,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        }),
      });
    },
    onError: () => errorToast(),
  });

  return { handleAssign: assignment.mutate, isAssigning: assignment.isPending };
};
