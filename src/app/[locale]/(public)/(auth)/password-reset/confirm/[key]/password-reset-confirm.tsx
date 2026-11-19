'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { confirmPasswordReset } from '@/actions/auth.actions';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utils/show';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Link } from '@/i18n/routing';
import { LOGIN_PATH } from '@/proxy/contants';
import { PasswordResetConfirmation } from '@/types/models/link-confirmation';

type State = PasswordResetConfirmation | 'pending' | 'error';

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
  const requested = useRef(false);

  const { mutate, data, isError } = useMutation({
    mutationFn: confirmPasswordReset,
    onError: () => errorToast(),
  });

  // The ref keeps React Strict Mode from sending the request twice: the second one would find the link spent.
  useEffect(() => {
    if (requested.current) {
      return;
    }

    requested.current = true;
    mutate(recoveryKey);
  }, [mutate, recoveryKey]);

  const state: State = data ?? (isError ? 'error' : 'pending');
  const nextStep = NEXT_STEP[state];

  return (
    <>
      <Paragraph className="text-base text-neutral-600">{t(`${state}.description`)}</Paragraph>
      {nextStep && (
        <Button size="big" className="my-4 w-full" asChild>
          <Link href={nextStep}>{t(`${state}.button`)}</Link>
        </Button>
      )}
      <Show when={state === 'error'}>
        <Button size="big" className="my-4 w-full" onClick={() => mutate(recoveryKey)}>
          {t('error.button')}
        </Button>
      </Show>
    </>
  );
};
