import 'server-only';

type CsvCell = string | number | boolean | null | undefined;

const escapeCell = (value: CsvCell) => {
  const text = String(value ?? '');
  const safeText = typeof value === 'string' && /^\s*[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
};

export const createCsvResponse = (rows: readonly (readonly CsvCell[])[], filename: string): Response => {
  const csv = `\uFEFF${rows.map((row) => row.map(escapeCell).join(';')).join('\r\n')}`;
  const safeFilename = filename.replace(/[\\/\r\n";]/g, '_');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="download.csv"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
      'Cache-Control': 'private, no-store',
    },
  });
};
