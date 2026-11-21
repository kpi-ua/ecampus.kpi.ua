'use server';

import { revalidatePath } from 'next/cache';
import qs from 'query-string';

import {
  SBP_RIGHTS_PATH,
  USER_SEARCH_MIN_CHARS,
} from '@/app/[locale]/(private)/module/studbonuspointsrights/constants';
import { campusFetch } from '@/lib/client';
import { EntityIdName } from '@/types/models/entity-id-name';
import {
  GrantSbpRightsPayload,
  GrantSbpRightsResult,
  SbpLoadCatalogItem,
  SbpResponsibilityListItem,
  SbpRightsHolder,
  SbpRightsListQuery,
  SbpSubdivisionCatalogItem,
} from '@/types/models/sbp-rights';

export const getSbpLoads = async (): Promise<SbpLoadCatalogItem[]> => {
  const response = await campusFetch<SbpLoadCatalogItem[]>('sbp-rights/loads');

  if (!response.ok) {
    throw new Error(`Failed to fetch SBP loads: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as SbpLoadCatalogItem[];
};

export const getSbpSubdivisions = async (): Promise<SbpSubdivisionCatalogItem[]> => {
  const response = await campusFetch<SbpSubdivisionCatalogItem[]>('sbp-rights/subdivisions');

  if (!response.ok) {
    throw new Error(`Failed to fetch SBP subdivisions: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as SbpSubdivisionCatalogItem[];
};

export const searchSbpUsers = async (query: string): Promise<EntityIdName[]> => {
  const trimmed = query.trim();
  if (trimmed.length < USER_SEARCH_MIN_CHARS) {
    return [];
  }

  const url = qs.stringifyUrl({ url: 'sbp-rights/users/search', query: { q: trimmed } });
  const response = await campusFetch<EntityIdName[]>(url);

  if (!response.ok) {
    throw new Error(`Failed to search SBP users: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as EntityIdName[];
};

export interface SbpRightsHoldersResult {
  items: SbpRightsHolder[];
  total: number;
}

export const getSbpRightsHolders = async (query: SbpRightsListQuery = {}): Promise<SbpRightsHoldersResult> => {
  const url = qs.stringifyUrl(
    { url: 'sbp-rights/users', query: { ...query } },
    { skipNull: true, skipEmptyString: true },
  );
  const response = await campusFetch<SbpRightsHolder[]>(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch SBP rights holders: ${response.status} ${response.statusText}`);
  }

  const items = (await response.json()) as SbpRightsHolder[];
  const total = parseInt(response.headers.get('x-total-count') ?? '0', 10) || 0;
  return { items, total };
};

/** Every active right of one person. */
export const getSbpUserRights = async (userAccountId: number): Promise<SbpResponsibilityListItem[]> => {
  const response = await campusFetch<SbpResponsibilityListItem[]>(`sbp-rights/users/${userAccountId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch SBP rights of user: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as SbpResponsibilityListItem[];
};

export const grantSbpRights = async (payload: GrantSbpRightsPayload): Promise<GrantSbpRightsResult> => {
  if (payload.scope === 'Faculty' && !payload.subdivisionId) {
    throw new Error("subdivisionId is required when scope is 'Faculty'");
  }

  const body = JSON.stringify({
    userAccountId: payload.userAccountId,
    scope: payload.scope,
    subdivisionId: payload.scope === 'University' ? undefined : payload.subdivisionId,
    loadIds: payload.loadIds,
  });

  const response = await campusFetch('sbp-rights', { method: 'POST', body });

  if (!response.ok) {
    throw new Error(`Failed to grant SBP rights: ${response.status} ${response.statusText}`);
  }

  const result = (await response.json()) as GrantSbpRightsResult;
  revalidatePath(SBP_RIGHTS_PATH);
  return result;
};

export const revokeSbpRight = async (sbpResponsibleId: number): Promise<void> => {
  const response = await campusFetch(`sbp-rights/${sbpResponsibleId}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Failed to revoke SBP right: ${response.status} ${response.statusText}`);
  }

  revalidatePath(SBP_RIGHTS_PATH);
};

export const revokeAllSbpRightsForUser = async (userAccountId: number): Promise<void> => {
  const response = await campusFetch(`sbp-rights/users/${userAccountId}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Failed to revoke all SBP rights for user: ${response.status} ${response.statusText}`);
  }

  revalidatePath(SBP_RIGHTS_PATH);
};
