'use server';

import { campusFetch } from '@/lib/client';
import { EntityIdName } from '@/types/models/entity-id-name';
import {
  SaveSbpPeriodPayload,
  SbpPeriod,
  SbpPeriodActionResult,
  SbpPeriodRuleViolation,
} from '@/types/models/sbp-periods';

/** Throws on failure: an empty list would read as «no periods yet» and switch the form's overlap checks off. */
export const getSbpPeriods = async (): Promise<SbpPeriod[]> => {
  const response = await campusFetch<SbpPeriod[]>('sbp-periods');
  if (!response.ok) {
    throw new Error(`Failed to fetch SBP periods: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as SbpPeriod[];
};

export const getSbpPeriodStudyYears = async (): Promise<EntityIdName[]> => {
  const response = await campusFetch<EntityIdName[]>('sbp-periods/study-years');
  if (!response.ok) {
    throw new Error(`Failed to fetch SBP study years: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as EntityIdName[];
};

/** A broken period rule comes back as a result, so the form can show it next to its field. */
const toResult = async (response: Response, failure: string): Promise<SbpPeriodActionResult> => {
  if (response.ok) {
    return { ok: true };
  }

  if (response.status === 400) {
    const body = (await response.json().catch(() => null)) as Partial<SbpPeriodRuleViolation> | null;
    if (body?.code) {
      return { ok: false, violation: { code: body.code, field: body.field ?? '', conflict: body.conflict ?? null } };
    }
  }

  throw new Error(`${failure}: ${response.status} ${response.statusText}`);
};

export const saveSbpPeriod = async (
  id: number | undefined,
  payload: SaveSbpPeriodPayload,
): Promise<SbpPeriodActionResult> => {
  const response = await campusFetch(id ? `sbp-periods/${id}` : 'sbp-periods', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(payload),
  });
  return toResult(response, 'Failed to save SBP period');
};

export const deleteSbpPeriod = async (id: number): Promise<SbpPeriodActionResult> => {
  const response = await campusFetch(`sbp-periods/${id}`, { method: 'DELETE' });
  return toResult(response, 'Failed to delete SBP period');
};
