'use client';

import { useQuery } from '@tanstack/react-query';

import { getCuratorAdminGroups, getCuratorLecturers } from '@/actions/curatorlecturer.actions';
import { curatorAdministrationQueryKeys } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/query-keys';
import { CURATOR_GROUP_STALE_TIME } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/query-keys';
import { CuratorAdministrationData } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

export const useCuratorAdministrationData = (
  initialData: CuratorAdministrationData,
  yearId?: number,
  departmentId?: number,
) => {
  const { errorToast } = useServerErrorToast();

  return useQuery({
    queryKey: [...curatorAdministrationQueryKeys.groups, { yearId, departmentId }],
    queryFn: async () => {
      if (!yearId) {
        return { groups: [], lecturers: [] };
      }

      try {
        const [groups, lecturers] = await Promise.all([
          getCuratorAdminGroups(yearId, departmentId),
          getCuratorLecturers(departmentId),
        ]);
        return { groups, lecturers };
      } catch (error) {
        errorToast();
        throw error;
      }
    },
    enabled: !!yearId,
    initialData: !departmentId ? initialData : undefined,
    staleTime: CURATOR_GROUP_STALE_TIME,
    retry: false,
  });
};
