import { redirect } from 'next/navigation';

import { DEFAULT_LOCALE } from '@/i18n/routing';

export default function RootPage() {
  redirect(DEFAULT_LOCALE);
}
