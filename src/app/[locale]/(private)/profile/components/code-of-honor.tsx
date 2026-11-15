import { getTranslations } from 'next-intl/server';

import { Heading6 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import RichText from '@/components/typography/rich-text';
import { Separator } from '@/components/ui/separator';
import { Show } from '@/components/utils/show';
import { Link } from '@/i18n/routing';
import { User } from '@/types/models/user';

interface Props {
  user: User;
}

export async function CodeOfHonor({ user }: Props) {
  const t = await getTranslations('private.profile');

  return (
    <div className="flex flex-col gap-3">
      <Heading6>{t('codeOfHonor.title')}</Heading6>
      <Separator />
      <RichText>
        {(tags) =>
          t.rich('codeOfHonor.content', {
            ...tags,
            documentsLink: (chunks) => <Link href="/kpi-documents">{chunks}</Link>,
            paragraph: (chunks) => <Paragraph className="m-0 text-lg">{chunks}</Paragraph>,
          })
        }
      </RichText>
      <Show when={!!user.codeOfHonorSignDate}>
        <div className="flex flex-col gap-1">
          <Paragraph>{t('codeOfHonor.agreement')}</Paragraph>
          <Paragraph className="m-0">{user.codeOfHonorSignDate}</Paragraph>
        </div>
      </Show>
    </div>
  );
}
