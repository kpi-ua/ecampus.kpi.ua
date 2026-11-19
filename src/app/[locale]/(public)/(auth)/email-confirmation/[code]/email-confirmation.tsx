'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { confirmEmail } from '@/actions/settings.actions';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utils/show';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Link } from '@/i18n/routing';
import { EmailConfirmation as EmailConfirmationResult } from '@/types/models/link-confirmation';

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
  const requested = useRef(false);

  const { mutate, data, isError } = useMutation({
    mutationFn: confirmEmail,
    onError: () => errorToast(),
  });

  // The ref keeps React Strict Mode from sending the request twice: the second one would find the code spent.
  useEffect(() => {
    if (requested.current) {
      return;
    }

    requested.current = true;
    mutate(code);
  }, [mutate, code]);

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
        <Button size="big" className="my-4 w-full" onClick={() => mutate(code)}>
          {t('error.button')}
        </Button>
      </Show>
    </>
  );
};
