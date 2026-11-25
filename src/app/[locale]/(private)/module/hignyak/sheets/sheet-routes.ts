import { notFound } from 'next/navigation';

import { dnvrSheetKinds, type DnvrSheetKind } from '@/types/models/dnvr-sheets';

import { DNVR_PATH } from '../routes';

export function getSheetKind(value: string): DnvrSheetKind {
  const kind = dnvrSheetKinds.find((item) => item === value);
  if (!kind) {
    notFound();
  }

  return kind;
}

export function getSheetRouteId(value: string) {
  const id = Number(value);
  if (!/^\d+$/.test(value) || id < 1 || id > 2147483647) {
    notFound();
  }

  return id;
}

export function getDnvrSheetsPath(kind: DnvrSheetKind) {
  return `${DNVR_PATH}/sheets/${kind}`;
}
