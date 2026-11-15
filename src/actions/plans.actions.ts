'use server';

import { revalidatePath } from 'next/cache';

import { campusFetch } from '@/lib/client';
import {
  PlanCatalog,
  PlanCreateRequest,
  PlanLoad,
  PlanOption,
  PlanResponsibility,
  PlanWorkplace,
  PlanYear,
} from '@/types/models/plans';

const PATH = '/module/plans';

const read = async <T>(url: string): Promise<T> => {
  const response = await campusFetch<T>(url);
  if (!response.ok) {
    throw new Error(`Plans request failed: ${response.status}`);
  }
  return response.json();
};

const mutate = async (url: string, method: 'POST' | 'PATCH' | 'PUT' | 'DELETE', body?: object) => {
  const response = await campusFetch(url, { method, body: body ? JSON.stringify(body) : undefined });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { code?: string };
    return { ok: false, status: response.status, code: error.code };
  }
  revalidatePath(PATH);
  return { ok: true, status: response.status, code: undefined };
};

export const getPlanYears = async () => read<PlanYear[]>('plans/years');
export const getPlanWorkplaces = async () => read<PlanWorkplace[]>('plans/workplaces');
export const getPlanLoads = async (yearId: number, semester: number) =>
  read<PlanLoad[]>(`plans?yearId=${yearId}&semester=${semester}`);
export const getPlanCatalog = async (workplaceId: number) =>
  read<PlanCatalog>(`plans/catalog?workplaceId=${workplaceId}`);
export const getPlanGroups = async (workplaceId: number, rowId: number) =>
  read<PlanOption[]>(`plans/groups?workplaceId=${workplaceId}&rowId=${rowId}`);
export const getPlanResponsibilities = async (semester: number) =>
  read<PlanResponsibility[]>(`plans/responsibilities?semester=${semester}`);
export const createPlanLoads = async (payload: PlanCreateRequest) => {
  const response = await campusFetch<{ created: number }>('plans', { method: 'POST', body: JSON.stringify(payload) });
  if (!response.ok) {
    return { ok: false, created: 0 };
  }
  const result = await response.json();
  revalidatePath(PATH);
  return { ok: true, created: result.created };
};
export const updatePlanHours = async (id: number, plannedHours: number) =>
  mutate(`plans/${id}/hours`, 'PATCH', { plannedHours });
export const deletePlanLoad = async (id: number, confirmActiveAttestations = false) =>
  mutate(`plans/${id}?confirmActiveAttestations=${confirmActiveAttestations}`, 'DELETE');
export const setPlanResponsible = async (rowId: number, semester: number, groupId: number, employeeId: number) =>
  mutate(`plans/responsibilities/${rowId}/${semester}/${groupId}`, 'PUT', { employeeId });
