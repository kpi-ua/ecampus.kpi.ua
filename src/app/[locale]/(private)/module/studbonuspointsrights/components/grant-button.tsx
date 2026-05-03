import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export function GrantButton() {
  const t = useTranslations('private.studbonuspointsrights.grant');

  return (
    <Button asChild size="small">
      <Link href="/module/studbonuspointsrights/grant">
        <Plus />
        {t('button')}
      </Link>
    </Button>
  );
}
