import { getTranslations } from 'next-intl/server';

import { Card } from '@/components/ui/card';

export default async function Page() {
  const t = await getTranslations('private.session-administration');
  return (
    <Card className="space-y-4 p-6">
      <h2 className="text-xl font-semibold">{t('instructions')}</h2>
      <p>{t('instructionsDescription')}</p>
      <a className="underline" href="/documents/session-administration.doc" download>
        {t('downloadInstructions')}
      </a>
    </Card>
  );
}
