'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { K7ReportRequest, K7ReportRequestStatus } from '@/types/models/k7-form';

type ReportStatusKey = 'pending' | 'ready' | 'inProgress' | 'error';

const CDN_BASE_URL = 'https://cdn.cloud.kpi.ua/';

interface Props {
  reports: K7ReportRequest[];
  departmentNames: Record<number, string>;
}

const statusTranslationKey: Record<K7ReportRequestStatus, ReportStatusKey> = {
  Pending: 'pending',
  InProgress: 'inProgress',
  Ready: 'ready',
  Error: 'error',
};

const statusBadgeClassName: Record<ReportStatusKey, string> = {
  pending: 'border-other-blue bg-other-blue/10 text-other-blue',
  ready: 'border-status-success-300 bg-status-success-100 text-status-success-300',
  inProgress: 'border-other-blue bg-other-blue/10 text-other-blue',
  error: 'border-status-danger-300 bg-status-danger-100 text-status-danger-300',
};

export const K7ReportsTable = ({ reports, departmentNames }: Props) => {
  const t = useTranslations('private.k-reports.k-7');

  if (reports.length === 0) {
    return <p className="text-muted-foreground py-12 text-center text-sm">{t('table.empty')}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[150px] bg-neutral-50 text-xs normal-case">{t('table.createdAt')}</TableHead>
          <TableHead className="min-w-[120px] bg-neutral-50 text-xs normal-case">{t('table.academicYear')}</TableHead>
          <TableHead className="min-w-[120px] bg-neutral-50 text-xs normal-case">{t('table.department')}</TableHead>
          <TableHead className="min-w-[120px] bg-neutral-50 text-xs normal-case">{t('table.position')}</TableHead>
          <TableHead className="min-w-[120px] bg-neutral-50 text-xs normal-case">{t('table.status')}</TableHead>
          <TableHead className="min-w-[240px] bg-neutral-50 text-right text-xs normal-case">
            {t('table.actions')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => {
          const statusKey = statusTranslationKey[report.status] ?? 'inProgress';
          const isReady = report.status === 'Ready';

          return (
            <TableRow key={report.k7ReportRequestId}>
              <TableCell className="py-4 font-normal whitespace-nowrap">
                {dayjs(report.requestedAt).format('DD.MM.YYYY, HH:mm')}
              </TableCell>
              <TableCell>
                {report.year}-{report.year + 1}
              </TableCell>
              <TableCell>{departmentNames[report.departmentId] ?? report.departmentId}</TableCell>
              <TableCell>{report.position}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    'leading-xs justify-center rounded-[8px] border px-4 py-[5px] text-xs font-semibold',
                    statusBadgeClassName[statusKey],
                  )}
                >
                  {t(`status.${statusKey}`)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {isReady && (
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="secondary" size="small" className="h-10 rounded-[8px] px-5 py-0 text-xs">
                      <Link href={`/k-7/preview?k7ReportRequestId=${encodeURIComponent(report.k7ReportRequestId)}`}>
                        {t('actions.view')}
                      </Link>
                    </Button>
                    {report.s3StorageKey && (
                      <Button asChild variant="secondary" size="small" className="h-10 rounded-[8px] px-5 py-0 text-xs">
                        <a href={new URL(report.s3StorageKey, CDN_BASE_URL).href} download>
                          {t('actions.downloadPdf')}
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
