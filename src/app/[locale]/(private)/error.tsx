'use client';

import { useEffect } from 'react';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

export default function Error() {
  const { errorToast } = useServerErrorToast();

  useEffect(() => {
    errorToast();
  }, []);

  return <></>;
}
