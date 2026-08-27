const KPI_CORPORATE_EMAIL_DOMAINS = ['kpi.ua', 'kpi.edu.ua'];

export const isKpiCorporateEmail = (email: string) => {
  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase();

  return KPI_CORPORATE_EMAIL_DOMAINS.some(
    (corporateDomain) => domain === corporateDomain || domain.endsWith(`.${corporateDomain}`),
  );
};
