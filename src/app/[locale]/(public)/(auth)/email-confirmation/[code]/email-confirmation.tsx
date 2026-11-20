'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { confirmEmail } from '@/actions/settings.actions';
import { CircleWavyCheck, SpinnerGap, Warning } from '@/app/images';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utils/show';
import { useRunOnce } from '@/hooks/use-run-once';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Link } from '@/i18n/routing';
import { EmailConfirmationResult } from '@/types/models/link-confirmation';

type State = EmailConfirmationResult | 'pending' | 'error';

const NEXT_STEP: Partial<Record<State, string>> = {
  success: '/',
  invalid: '/settings',
};

interface Props {
  code: string;
}

export const EmailConfirmation = ({ code }: Props) => {
  const t = useTranslations('auth.emailConfirmation');
  const { errorToast } = useServerErrorToast();

  const { mutate, data, isError } = useMutation({
    mutationFn: confirmEmail,
    onError: () => errorToast(),
  });

  const confirmEmailMutation = useCallback(() => mutate(code), [mutate, code]);

  useRunOnce(confirmEmailMutation);

  const state: State = data ?? (isError ? 'error' : 'pending');
  const nextStep = NEXT_STEP[state];

  return (
    <>
      <Show
        when={state !== 'pending'}
        fallback={
          <div className="flex items-center justify-center py-6">
            <SpinnerGap className="text-basic-blue" />
          </div>
        }
      >
        <Alert variant={state === 'success' ? 'default' : 'destructive'} className="my-4">
          <AlertDescription className="flex items-center gap-4">
            <Show when={state === 'success'} fallback={<Warning className="text-status-danger-300" />}>
              <CircleWavyCheck className="text-status-success-300" />
            </Show>
            {t(`${state}.description`)}
          </AlertDescription>
        </Alert>
      </Show>
      {nextStep && (
        <Button size="big" className="my-4 w-full" asChild>
          <Link href={nextStep}>{t(`${state}.button`)}</Link>
        </Button>
      )}
      <Show when={state === 'error'}>
        <Button size="big" className="my-4 w-full" onClick={() => mutate(code)}>
          {t('error.button')}
        </Button>
      </Show>
    </>
  );
};
