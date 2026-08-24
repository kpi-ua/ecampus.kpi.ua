import { getTranslations } from 'next-intl/server';

import { LocaleProps } from '@/types/locale-props';

interface Props {
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'private.k-7' });

  return { title: t('title') };
}

export default function K7DashboardLayout({ children }: Props) {
  return children;
}
