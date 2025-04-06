import { useTranslations } from 'next-intl';
import { useToast } from './use-toast';

export const useServerErrorToast = () => {
  const errorTranslation = useTranslations('global.server-error');
  const { toast } = useToast();

  const errorToast = () =>
    toast({
      variant: 'destructive',
      title: errorTranslation('title'),
      description: errorTranslation('description'),
    });

  return { errorToast };
};
