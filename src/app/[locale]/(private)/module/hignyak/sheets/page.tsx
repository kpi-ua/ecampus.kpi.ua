import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/routing';

import { getDnvrSheetsPath } from './sheet-routes';

export default async function Page() {
  return redirect({ href: getDnvrSheetsPath('exam'), locale: await getLocale() });
}
