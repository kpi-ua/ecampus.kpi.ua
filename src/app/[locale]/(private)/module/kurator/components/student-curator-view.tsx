import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Description, Heading4, Heading6, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Show } from '@/components/utils/show';
import { Curator } from '@/types/models/curator';

interface Props {
  curator: Curator | null;
}

export const StudentCuratorView = ({ curator }: Props) => {
  const t = useTranslations('private.curator');

  return (
    <>
      <Description>{t('info')}</Description>
      <Card className="rounded-b-6 col-span-full flex w-full flex-col gap-4 bg-white p-4 sm:gap-6 sm:p-6 md:p-9 xl:col-span-5">
        <Show when={!!curator} fallback={<Heading6>{t('not-found')}</Heading6>}>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <ProfilePicture size="xl" src={curator?.userInfo.photo ?? ''} />
            <Heading4 className="text-basic-black">{curator?.userInfo.fullName}</Heading4>
          </div>
          <div className="flex flex-col gap-3">
            <Heading6>{t('curator-info')}</Heading6>
            <hr />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <Paragraph className="m-0 w-full text-lg font-semibold text-neutral-400 sm:w-[170px]">
                  {t('subdivisions')}
                </Paragraph>
                <div className="flex flex-1 flex-col gap-2">
                  {curator?.subdivisions.map((subdivision) => (
                    <Paragraph key={subdivision.id} className="text-basic-black m-0 text-lg font-normal break-words">
                      {subdivision.name}
                    </Paragraph>
                  ))}
                </div>
              </div>
              <Show when={!!curator?.contacts.length}>
                <div className="flex flex-col gap-2">
                  <Paragraph className="m-0 text-lg font-semibold text-neutral-400">{t('contacts')}</Paragraph>
                  {curator?.contacts.map((contact, index) => (
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-6" key={`${contact.name}-${index}`}>
                      <Paragraph className="m-0 w-full text-lg font-semibold text-neutral-400 sm:w-[170px] sm:pl-4">
                        {contact.name}
                      </Paragraph>
                      <Paragraph className="text-basic-black m-0 text-lg font-normal break-all">
                        {contact.value}
                      </Paragraph>
                    </div>
                  ))}
                </div>
              </Show>
              <Show when={!!curator?.userInfo.profile}>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                  <Paragraph className="m-0 w-full text-lg font-semibold text-neutral-400 sm:w-[170px]">
                    {t('profile')}
                  </Paragraph>
                  <Paragraph className="text-basic-black m-0 flex-1 text-lg font-normal break-all">
                    <Link href={curator?.userInfo.profile ?? ''} target="_blank" rel="noopener noreferrer">
                      {curator?.userInfo.profile}
                    </Link>
                  </Paragraph>
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </Card>
    </>
  );
};
