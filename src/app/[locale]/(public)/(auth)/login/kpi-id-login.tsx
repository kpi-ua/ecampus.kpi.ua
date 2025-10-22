'use client';

import { useLocale } from 'next-intl';
import Script from 'next/script';

export const KPIIDLogin = () => {
  const locale = useLocale();

  const init = () => {
    if (window.KPIID) {
      window.KPIID.init();
    }
  };

  // Make sure to keep this empty div wrapper. Read here:
  // https://github.com/vercel/next.js/discussions/25049
  return (
    <div>
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
      <Script id="kpi-script" src={process.env.NEXT_PUBLIC_KPI_ID_BUTTON!} strategy="lazyOnload" onReady={init} />
    </div>
  );
};
