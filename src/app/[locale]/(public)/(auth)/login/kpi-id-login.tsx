'use client';

import { useScript } from '@/hooks/use-script';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

export const KPIIDLogin = () => {
  const locale = useLocale();
  const isInitialized = useScript(process.env.NEXT_PUBLIC_KPI_ID_BUTTON!, true);

  useEffect(() => {
    if (window.KPIID && isInitialized) {
      window.KPIID.init();
    }
  }, [isInitialized]);

  return (
    <div
      id="kpi_id_signin"
      data-app-id={process.env.NEXT_PUBLIC_KPI_ID_APP_ID!}
      data-size="large"
      data-logo-alignment="left"
      data-locale={locale}
      data-color="outline"
      data-class-name="my-4"
      data-full-width="true"
      data-dev-mode={String(process.env.NEXT_PUBLIC_ENV !== 'production')}
    ></div>
  );
};
