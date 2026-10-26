import 'server-only';

import { stringify } from 'csv-stringify/sync';

type CsvCell = string | number | boolean | null | undefined;

export const createCsvResponse = (rows: readonly (readonly CsvCell[])[], filename: string): Response => {
  const csv = stringify(
    rows.map((row) => [...row]),
    {
      bom: true,
      delimiter: ';',
      record_delimiter: 'windows',
      quoted: true,
      quoted_empty: true,
      escape_formulas: true,
      eof: false,
    },
  );
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="download.csv"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Cache-Control': 'private, no-store',
    },
  });
};
