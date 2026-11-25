'use server';

import { revalidatePath } from 'next/cache';

import { campusFetch } from '@/lib/client';
import {
  PlanCatalog,
  PlanCreateBatchRequest,
  PlanLoad,
  PlanOption,
  PlanResponsibility,
  PlanWorkplace,
} from '@/types/models/plans';

const PATH = '/module/plans';

export async function getPlanWorkplaces() {
  const response = await campusFetch<PlanWorkplace[]>('plans/workplaces');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getPlanLoads(semester = 0) {
  const response = await campusFetch<PlanLoad[]>(`plans?semester=${semester}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getPlanCatalog(workplaceId: number) {
  const response = await campusFetch<PlanCatalog>(`plans/catalog?workplaceId=${workplaceId}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getPlanGroups(workplaceId: number, rowId: number) {
  const response = await campusFetch<PlanOption[]>(`plans/groups?workplaceId=${workplaceId}&rowId=${rowId}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getPlanResponsibilities(semester: number) {
  const response = await campusFetch<PlanResponsibility[]>(`plans/responsibilities?semester=${semester}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export const createPlanLoads = async (payload: PlanCreateBatchRequest) => {
  const response = await campusFetch<{ created: number }>('plans/batch', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return { ok: false, created: 0 };
  }
  const result = await response.json();
  revalidatePath(PATH);
  return { ok: true, created: result.created };
};
export async function updatePlanHours(id: number, plannedHours: number) {
  const response = await campusFetch(`plans/${id}/hours`, { method: 'PATCH', body: JSON.stringify({ plannedHours }) });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { code?: string };
    return { ok: false, status: response.status, code: error.code };
  }
  revalidatePath(PATH);
  return { ok: true, status: response.status, code: undefined };
}

export async function deletePlanLoad(id: number, confirmActiveAttestations = false) {
  const response = await campusFetch(`plans/${id}?confirmActiveAttestations=${confirmActiveAttestations}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { code?: string };
    return { ok: false, status: response.status, code: error.code };
  }
  revalidatePath(PATH);
  return { ok: true, status: response.status, code: undefined };
}

export async function setPlanResponsible(rowId: number, semester: number, groupId: number, employeeId: number) {
  const response = await campusFetch(`plans/responsibilities/${rowId}/${semester}/${groupId}`, {
    method: 'PUT',
    body: JSON.stringify({ employeeId }),
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { code?: string };
    return { ok: false, status: response.status, code: error.code };
  }
  revalidatePath(PATH);
  return { ok: true, status: response.status, code: undefined };
}
