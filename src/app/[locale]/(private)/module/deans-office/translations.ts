import { type getTranslations } from 'next-intl/server';

export const INTL_NAMESPACE = 'private.deans-office';
export type DeansOfficeTranslations = Awaited<ReturnType<typeof getTranslations<typeof INTL_NAMESPACE>>>;
