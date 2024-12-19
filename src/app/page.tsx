import { DEFAULT_LOCALE } from '@/i18n/routing';
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect(DEFAULT_LOCALE);
}
