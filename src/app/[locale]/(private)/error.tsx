'use client';

import { useRunOnce } from '@/hooks/use-run-once';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

export default function Error() {
  const { errorToast } = useServerErrorToast();

  useRunOnce(errorToast);

  return <></>;
}
