import dayjs from 'dayjs';

import { BibliotekaEmployee } from '@/types/models/biblioteka';

export const exportEmployees = (employees: BibliotekaEmployee[], label: string, nameHeader: string) => {
  const rows = [
    [nameHeader, 'ORCID', 'Scopus ID', 'Researcher ID', 'Google Scholar'],
    ...employees.map((employee) => [
      `${employee.surname} ${employee.name} ${employee.patronymic}`,
      employee.orcid,
      employee.scopusId,
      employee.researcherId,
      employee.googleScholarId,
    ]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(';')).join('\n')}`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  link.download = `biblioteka-${label}-${dayjs().format('YYYY-MM-DD')}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
