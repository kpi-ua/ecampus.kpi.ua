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

/** A person with active rights, returned by `GET /sbp-rights/users`. */
export interface SbpRightsHolder {
  userAccountId: number;
  fullName: string;
  /** Distinct subdivisions of the person's rights; the university-wide row for whole-university rights. */
  subdivisions: SbpSubdivisionCatalogItem[];
  rightsCount: number;
}

/** Denormalized row returned by `GET /sbp-rights` and `GET /sbp-rights/users/{id}`. */
export interface SbpResponsibilityListItem {
  id: number;
  userAccountId: number;
  fullName: string;
  scope: AccessScope;
  subdivisionId: number;
  subdivisionName: string;
  subdivisionAbbreviation: string | null;
  loadId: number;
  loadName: string;
  loadSubTreeNumber: number | null;
  treeName: string;
  workKindName: string;
  changeDate: string | null;
  comment: string | null;
}

/** Filters for `GET /sbp-rights` and `GET /sbp-rights/users`; `null` (an unset URL filter) is dropped like `undefined`. */
export interface SbpRightsListQuery {
  search?: string | null;
  userAccountId?: number | null;
  loadId?: number | null;
  subdivisionId?: number | null;
  page?: number | null;
  pageSize?: number | null;
}

export interface GrantSbpRightsPayload {
  userAccountId: number;
  scope: AccessScope;
  /** Required when `scope === 'Faculty'`; ignored otherwise. */
  subdivisionId?: number;
  loadIds: number[];
}

export interface GrantSbpRightsResult {
  createdIds: number[];
  /** Loads that already had an active grant — no new row was created for them. */
  skippedDuplicates: number[];
}
