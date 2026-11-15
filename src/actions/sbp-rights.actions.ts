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
  SbpRightsListQuery,
  SbpStudyYearCatalogItem,
  SbpSubdivisionCatalogItem,
} from '@/types/models/sbp-rights';

export const getSbpLoads = async (): Promise<SbpLoadCatalogItem[]> => {
  try {
    const response = await campusFetch<SbpLoadCatalogItem[]>('sbp-rights/loads');
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching SBP loads:', error);
    return [];
  }
};

export const getSbpSubdivisions = async (): Promise<SbpSubdivisionCatalogItem[]> => {
  try {
    const response = await campusFetch<SbpSubdivisionCatalogItem[]>('sbp-rights/subdivisions');
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching SBP subdivisions:', error);
    return [];
  }
};

export const getSbpStudyYears = async (): Promise<SbpStudyYearCatalogItem[]> => {
  try {
    const response = await campusFetch<SbpStudyYearCatalogItem[]>('sbp-rights/study-years');
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching SBP study years:', error);
    return [];
  }
};

export const searchSbpUsers = async (query: string): Promise<EntityIdName[]> => {
  try {
    const trimmed = query.trim();
    if (trimmed.length < USER_SEARCH_MIN_CHARS) {
      return [];
    }
    const url = qs.stringifyUrl({ url: 'sbp-rights/users/search', query: { q: trimmed } });
    const response = await campusFetch<EntityIdName[]>(url);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching SBP users:', error);
    return [];
  }
};

export interface SbpRightsResult {
  items: SbpResponsibilityListItem[];
  total: number;
}

export const getSbpRights = async (query: SbpRightsListQuery = {}): Promise<SbpRightsResult> => {
  try {
    const url = qs.stringifyUrl({ url: 'sbp-rights', query: { ...query } }, { skipNull: true, skipEmptyString: true });
    const response = await campusFetch<SbpResponsibilityListItem[]>(url);

    if (!response.ok) {
      return { items: [], total: 0 };
    }

    const items = (await response.json()) as SbpResponsibilityListItem[];
    const total = parseInt(response.headers.get('x-total-count') ?? '0', 10) || 0;
    return { items, total };
  } catch (error) {
    console.error('Error fetching SBP rights:', error);
    return { items: [], total: 0 };
  }
};

export const grantSbpRights = async (payload: GrantSbpRightsPayload): Promise<GrantSbpRightsResult> => {
  if (payload.scope === 'Faculty' && !payload.subdivisionId) {
    throw new Error("subdivisionId is required when scope is 'Faculty'");
  }

  const body = JSON.stringify({
    userAccountId: payload.userAccountId,
    scope: payload.scope,
    subdivisionId: payload.scope === 'University' ? undefined : payload.subdivisionId,
    studyingYearId: payload.studyingYearId,
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
