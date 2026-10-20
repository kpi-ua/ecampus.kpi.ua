'use client';

import { useLocale } from 'next-intl';
import Script from 'next/script';
import { KPIID_LOGIN_PATH } from '@/proxy/contants';

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
        data-login-url={KPIID_LOGIN_PATH}
        data-size="large"
        data-logo-alignment="left"
        data-locale={locale}
        data-color="brand"
        data-full-width="true"
      ></div>
      <Script id="kpi-script" src={process.env.NEXT_PUBLIC_KPI_ID_BUTTON!} strategy="lazyOnload" onReady={init} />
    </div>
  );
};
