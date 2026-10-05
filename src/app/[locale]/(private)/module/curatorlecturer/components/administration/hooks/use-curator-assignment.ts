'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { assignGroupCurator } from '@/actions/curatorlecturer.actions';
import { curatorAdministrationQueryKeys } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/query-keys';
import { CuratorAdministrationData, CuratorGroup, CuratorLecturer } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

export const useCuratorAssignment = (group: CuratorGroup, lecturers: CuratorLecturer[]) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const departmentLecturers = lecturers.filter((item) => item.department.id === group.departmentId);
  const selectedLecturer = departmentLecturers.find((item) => item.employeeId === Number(employeeId));
  const canAssign = !!selectedLecturer && !!startDate && !!endDate && endDate >= startDate;
  const assignment = useMutation({
    mutationFn: (lecturer: CuratorLecturer) => assignGroupCurator(group.groupId, lecturer.employeeId, startDate, endDate),
    onSuccess: async (_, lecturer) => {
      queryClient.setQueriesData<CuratorAdministrationData>(
        { queryKey: curatorAdministrationQueryKeys.groups },
        (current) => current && {
          ...current,
          groups: current.groups.map((item) =>
            item.groupId === group.groupId
              ? { ...item, curatorEmployeeId: lecturer.employeeId, curatorName: lecturer.fullName }
              : item,
          ),
        },
      );
      await queryClient.invalidateQueries({ queryKey: curatorAdministrationQueryKeys.assignments(group.groupId) });
      toast({ title: t('success.title'), description: t('success.description', { group: group.name }) });
    },
    onError: () => errorToast(),
  });

  const handleAssign = () => {
    if (selectedLecturer && canAssign && !assignment.isPending) {
      assignment.mutate(selectedLecturer);
    }
  };

  return {
    employeeId,
    setEmployeeId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    departmentLecturers,
    canAssign,
    handleAssign,
    isAssigning: assignment.isPending,
  };
};
