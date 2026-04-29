'use server';

import { revalidatePath } from 'next/cache';
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

const MODULE_PATH = '/module/studbonuspointsrights';

/**
 * Whether the current user is a SuperAdmin allowed to access the SBP rights
 * admin module. Public endpoint (no `RequireSbpRightsAdmin` guard) so the FE
 * can use the result to decide whether to render the menu entry.
 */
export const getSbpRightsMe = async (): Promise<{ isSuperAdmin: boolean }> => {
  try {
    const response = await campusFetch<{ isSuperAdmin: boolean }>('sbp-rights/me');
    if (!response.ok) {
      return { isSuperAdmin: false };
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching SBP rights identity:', error);
    return { isSuperAdmin: false };
  }
};

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
    if (trimmed.length < 2) {
      return [];
    }
    const params = new URLSearchParams({ q: trimmed });
    const response = await campusFetch<EntityIdName[]>(`sbp-rights/users/search?${params.toString()}`);
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
    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);
    if (query.userAccountId) params.set('userAccountId', String(query.userAccountId));
    if (query.sbpDcLoadId) params.set('sbpDcLoadId', String(query.sbpDcLoadId));
    if (query.dcSubdivisionId) params.set('dcSubdivisionId', String(query.dcSubdivisionId));
    if (query.dcStudingYearId) params.set('dcStudingYearId', String(query.dcStudingYearId));
    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));

    const qs = params.toString();
    const url = qs ? `sbp-rights?${qs}` : 'sbp-rights';
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
  const body = JSON.stringify({
    userAccountId: payload.userAccountId,
    scope: payload.scope,
    dcSubdivisionId: payload.scope === 'University' ? undefined : payload.dcSubdivisionId,
    dcStudingYearId: payload.dcStudingYearId,
    sbpDcLoadIds: payload.sbpDcLoadIds,
  });

  const response = await campusFetch('sbp-rights', { method: 'POST', body });

  if (!response.ok) {
    throw new Error(`Failed to grant SBP rights: ${response.status} ${response.statusText}`);
  }

  const result = (await response.json()) as GrantSbpRightsResult;
  revalidatePath(MODULE_PATH);
  return result;
};

export const revokeSbpRight = async (sbpResponsibleId: number): Promise<void> => {
  const response = await campusFetch(`sbp-rights/${sbpResponsibleId}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Failed to revoke SBP right: ${response.status} ${response.statusText}`);
  }

  revalidatePath(MODULE_PATH);
};
