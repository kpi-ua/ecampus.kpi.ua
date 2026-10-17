'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { assignGroupCurator } from '@/actions/curatorlecturer.actions';
import { curatorAdministrationQueryKeys } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/query-keys';
import { CuratorGroup } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

interface AssignmentValues {
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
    mutationFn: ({ employeeId, startDate, endDate }: AssignmentValues) =>
      assignGroupCurator(group.groupId, employeeId, startDate, endDate),
    onSuccess: async (result, { startDate, endDate }) => {
      if (result !== 'assigned') return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: curatorAdministrationQueryKeys.groups }),
        queryClient.invalidateQueries({ queryKey: curatorAdministrationQueryKeys.assignments(group.groupId) }),
      ]);
      toast({
        title: t('success.title'),
        description: t('success.description', {
          group: group.name,
          startDate: dayjs(startDate).format('DD.MM.YYYY'),
          endDate: dayjs(endDate).format('DD.MM.YYYY'),
        }),
      });
    },
    onError: () => errorToast(),
  });

  return { handleAssign: assignment.mutate, isAssigning: assignment.isPending };
};
