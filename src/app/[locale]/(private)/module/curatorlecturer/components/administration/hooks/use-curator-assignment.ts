'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { assignGroupCurator } from '@/actions/curatorlecturer.actions';
import { curatorAdministrationQueryKeys } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/query-keys';
import { CuratorGroup } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

export const useCuratorAssignment = (group: CuratorGroup) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState(() => formatDate(group.studyStartDate));
  const [endDate, setEndDate] = useState(() => formatDate(group.expectedCompletionDate));

  const assignment = useMutation({
    mutationFn: () => assignGroupCurator(group.groupId, Number(employeeId), startDate, endDate),
    onSuccess: async () => {
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

  const handleAssign = () => {
    if (assignment.isPending) {
      return;
    }

    assignment.mutate();
  };

  return {
    employeeId,
    setEmployeeId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleAssign,
    isAssigning: assignment.isPending,
  };
};
