import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

import { SBP_RIGHTS_GRANT_PATH } from '../constants';

export function GrantButton() {
  const t = useTranslations('private.studbonuspointsrights.grant');

  return (
    <Button asChild size="small">
      <Link href={SBP_RIGHTS_GRANT_PATH}>
        <Plus />
        {t('button')}
      </Link>
    </Button>
  );
}
