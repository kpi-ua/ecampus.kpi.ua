import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getSbpUserRights, revokeSbpRight } from '@/actions/sbp-rights.actions';

import { sbpQueryKeys } from '../query-keys';

/** Every active right of one person, loaded once `enabled`, and the revoke of one of them. */
export const useUserRights = (userAccountId: number, enabled: boolean) => {
  const queryClient = useQueryClient();
  const queryKey = sbpQueryKeys.userRights(userAccountId);
  const {
    data: rights,
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => getSbpUserRights(userAccountId),
    enabled,
    retry: false,
  });

  const revoke = async (sbpResponsibleId: number) => {
    await revokeSbpRight(sbpResponsibleId);
    await queryClient.invalidateQueries({ queryKey });
  };

  return { rights, isLoading, isError, revoke };
};
