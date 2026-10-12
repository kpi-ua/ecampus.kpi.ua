'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { assignGroupCurator, getCuratorAssignments } from '@/actions/curatorlecturer.actions';
import { curatorAdministrationQueryKeys } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/query-keys';
import { CuratorGroup } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { getAssignmentPeriodError } from '@/app/[locale]/(private)/module/curatorlecturer/utils/get-assignment-period-error';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

export const useCuratorAssignment = (group: CuratorGroup) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { data: assignments, isFetching: isLoadingAssignments } = useQuery({
    queryKey: curatorAdministrationQueryKeys.assignments(group.groupId),
    queryFn: () => getCuratorAssignments(group.groupId),
  });

  const assignment = useMutation({
    mutationFn: () => assignGroupCurator(group.groupId, Number(employeeId), startDate, endDate),
    onSuccess: async (result) => {
      if (result !== 'assigned') {
        setValidationError(result);
        return;
      }
      setValidationError(null);
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

  const handleAssign = () => {
    if (assignment.isPending) {
      return;
    }

    if (!employeeId) {
      setValidationError('lecturer-required');
      return;
    }
    const error = getAssignmentPeriodError(startDate, endDate, assignments ?? []);
    setValidationError(error);
    if (error || isLoadingAssignments) return;
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
    isLoadingAssignments,
    validationError,
  };
};
