import { type getTranslations } from 'next-intl/server';

export const INTL_NAMESPACE = 'private.ekanat';
export type DekanatTranslations = Awaited<ReturnType<typeof getTranslations<typeof INTL_NAMESPACE>>>;
