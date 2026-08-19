'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { getK7FormRequests } from '@/actions/k7-form.actions';
import { SpinnerGap } from '@/app/images';
import { Heading2, Paragraph } from '@/components/typography';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useRouter } from '@/i18n/routing';
import { K7_REPORT_REQUEST_STATUS } from '@/types/models/k7-form';

const POLLING_INTERVAL_MS = 5_000;

interface Props {
  requestId: string;
  all: boolean;
}

export const K7PreviewLoading = ({ requestId, all }: Props) => {
  const t = useTranslations('private.k-reports.k-7.generation');
  const router = useRouter();
  const { errorToast } = useServerErrorToast();

  useEffect(() => {
    let isActive = true;
    let hasShownPollingError = false;

    const pollRequest = async () => {
      if (!isActive) return;

      try {
        const requests = await getK7FormRequests({ all });
        const request = requests.find(({ k7ReportRequestId }) => k7ReportRequestId === requestId);

        if (!isActive || !request) return;

        // DataReady means the captured data can already be rendered; the file keeps rendering in
        // the background, so there is no reason to hold the user on the spinner until it is done.
        if (
          request.status === K7_REPORT_REQUEST_STATUS.DataReady ||
          request.status === K7_REPORT_REQUEST_STATUS.Ready
        ) {
          isActive = false;
          router.replace(`/k-7/preview?requestId=${encodeURIComponent(requestId)}${all ? '&all=true' : ''}`);
          return;
        }

        if (request.status === K7_REPORT_REQUEST_STATUS.Error) {
          isActive = false;
          errorToast();
          router.replace('/k-7');
        }
      } catch {
        if (isActive && !hasShownPollingError) {
          hasShownPollingError = true;
          errorToast();
        }
      }
    };

    void pollRequest();
    const intervalId = window.setInterval(pollRequest, POLLING_INTERVAL_MS);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [all, errorToast, requestId, router]);

  return (
    <main className="mx-auto flex w-full max-w-[1000px] min-w-0 flex-col">
      <Heading2 className="text-[18px] leading-[22px] text-neutral-900 lg:text-[18px] lg:leading-[22px]">
        {t('title')}
      </Heading2>

      <div
        className="border-neutral-divider mt-5 flex min-h-[114px] items-center gap-4 rounded-[10px] border bg-white px-5 py-4"
        role="status"
        aria-live="polite"
      >
        <SpinnerGap className="text-basic-blue size-8 shrink-0 animate-spin" />
        <div className="min-w-0">
          <p className="m-0 text-[14px] leading-[18px] font-semibold text-neutral-900">{t('cardTitle')}</p>
          <Paragraph className="mt-2 mb-0 text-[12px] !leading-[16px] font-medium text-neutral-500">
            {t('inProgress')}
          </Paragraph>
        </div>
      </div>
    </main>
  );
};
