import { EntityIdName } from './entity-id-name';

/**
 * Scope of an SBP rights grant. Mirrors `KPI.Domain.Base.AccessScope`
 * (serialized as a string thanks to `JsonStringEnumConverter`).
 */
export type AccessScope = 'Faculty' | 'University';

export interface SbpLoadCatalogItem {
  workKindId: number;
  workKindName: string;
  treeId: number;
  treeName: string;
  loadId: number;
  loadName: string;
  /** SubTreeNumber on the load row, used for display ordering. */
  subTreeNumber: number | null;
  mark: number;
}

export interface SbpSubdivisionCatalogItem {
  id: number;
  name: string;
  abbreviation: string | null;
  isUniversityWide: boolean;
}

export interface SbpStudyYearCatalogItem {
  id: number;
  name: string;
  isCurrent: boolean;
}

/** User search result for the grant autocomplete — reuses the shared `EntityIdName`. */
export type SbpUserPick = EntityIdName;

/** Denormalized row returned by `GET /sbp-rights`. */
export interface SbpResponsibilityListItem {
  id: number;
  userAccountId: number;
  fullName: string;
  scope: AccessScope;
  subdivisionId: number;
  subdivisionName: string;
  subdivisionAbbreviation: string | null;
  studyingYearId: number;
  studyingYearName: string;
  loadId: number;
  loadName: string;
  loadSubTreeNumber: number | null;
  treeName: string;
  workKindName: string;
  changeDate: string | null;
  comment: string | null;
}

export interface SbpRightsListQuery {
  search?: string;
  userAccountId?: number;
  loadId?: number;
  subdivisionId?: number;
  studyingYearId?: number;
  page?: number;
  pageSize?: number;
}

export interface GrantSbpRightsPayload {
  userAccountId: number;
  scope: AccessScope;
  /** Required when `scope === 'Faculty'`; ignored otherwise. */
  subdivisionId?: number;
  /** When omitted, the backend resolves the current study year. */
  studyingYearId?: number;
  loadIds: number[];
}

export interface GrantSbpRightsResult {
  createdIds: number[];
  /** Loads that already had an active grant — no new row was created for them. */
  skippedDuplicates: number[];
}
