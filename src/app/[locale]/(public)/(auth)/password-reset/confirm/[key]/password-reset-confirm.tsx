'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { confirmPasswordReset } from '@/actions/auth.actions';
import { CircleWavyCheck, SpinnerGap, Warning } from '@/app/images';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utils/show';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Link } from '@/i18n/routing';
import { LOGIN_PATH } from '@/proxy/contants';
import { PasswordResetConfirmationResult } from '@/types/models/link-confirmation';
import { useRunOnce } from '@/hooks/use-run-once';

type State = PasswordResetConfirmationResult | 'pending' | 'error';

const NEXT_STEP: Partial<Record<State, string>> = {
  success: LOGIN_PATH,
  expired: '/password-reset',
};

interface Props {
  recoveryKey: string;
}

export const PasswordResetConfirm = ({ recoveryKey }: Props) => {
  const t = useTranslations('auth.passwordResetConfirm');
  const { errorToast } = useServerErrorToast();

  const { mutate, data, isError } = useMutation({
    mutationFn: confirmPasswordReset,
    onError: () => errorToast(),
  });

  const confirmPasswordResetMutation = useCallback(() => mutate(recoveryKey), [mutate, recoveryKey]);
  
  useRunOnce(confirmPasswordResetMutation);

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
        <Button size="big" className="w-full my-4" asChild>
          <Link href={nextStep}>{t(`${state}.button`)}</Link>
        </Button>
      )}
      <Show when={state === 'error'}>
        <Button size="big" className="w-full my-4" onClick={() => mutate(recoveryKey)}>
          {t('error.button')}
        </Button>
      </Show>
    </>
  );
};
