'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { type KeyboardEvent, useState } from 'react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { K7_REPORT_REQUEST_STATUS, K7ReportRequest, K7ReportRequestStatus } from '@/types/models/k7-form';

import { K7ReportErrorDialog } from './k7-report-error-dialog';

const CDN_BASE_URL = 'https://cdn.cloud.kpi.ua';

type ReportStatusKey = 'pending' | 'ready' | 'inProgress' | 'error';

interface Props {
  reports: K7ReportRequest[];
  departmentNames: Record<number, string>;
}

const statusTranslationKey: Record<K7ReportRequestStatus, ReportStatusKey> = {
  [K7_REPORT_REQUEST_STATUS.Pending]: 'pending',
  [K7_REPORT_REQUEST_STATUS.InProgress]: 'inProgress',
  [K7_REPORT_REQUEST_STATUS.Ready]: 'ready',
  [K7_REPORT_REQUEST_STATUS.Error]: 'error',
};

const statusBadgeClassName: Record<ReportStatusKey, string> = {
  pending: 'border-other-blue bg-other-blue/10 text-other-blue',
  ready: 'border-status-success-300 bg-status-success-100 text-status-success-300',
  inProgress: 'border-other-blue bg-other-blue/10 text-other-blue',
  error: 'border-status-danger-300 bg-status-danger-100 text-status-danger-300',
};

export const K7ReportsTable = ({ reports, departmentNames }: Props) => {
  const t = useTranslations('private.k-reports.k-7');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  if (reports.length === 0) {
    return <p className="text-muted-foreground py-12 text-center text-sm">{t('table.empty')}</p>;
  }

  const handleErrorRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    setErrorDialogOpen(true);
  };

  return (
    <>
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
            const isReady = report.status === K7_REPORT_REQUEST_STATUS.Ready;
            const isError = report.status === K7_REPORT_REQUEST_STATUS.Error;

            return (
              <TableRow
                key={report.k7ReportRequestId}
                className={cn(
                  isError &&
                    'focus-visible:outline-basic-blue cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                )}
                onClick={isError ? () => setErrorDialogOpen(true) : undefined}
                onKeyDown={isError ? handleErrorRowKeyDown : undefined}
                role={isError ? 'button' : undefined}
                tabIndex={isError ? 0 : undefined}
              >
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
                        <Link href={`/k-7/preview?requestId=${encodeURIComponent(report.k7ReportRequestId)}`}>
                          {t('actions.view')}
                        </Link>
                      </Button>
                      {report.s3StorageKey && (
                        <Button
                          asChild
                          variant="secondary"
                          size="small"
                          className="h-10 rounded-[8px] px-5 py-0 text-xs"
                        >
                          <a href={`${CDN_BASE_URL}/${report.s3StorageKey}`} download>
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

      <K7ReportErrorDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen} />
    </>
  );
};
