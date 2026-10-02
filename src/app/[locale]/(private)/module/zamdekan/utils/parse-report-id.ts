import { notFound } from 'next/navigation';

export const parseReportId = (value: string): number => {
  const id = Number(value);
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(id)) notFound();
  return id;
};
