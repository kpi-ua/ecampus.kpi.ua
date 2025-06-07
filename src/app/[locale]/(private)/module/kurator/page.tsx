import Link from 'next/link';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading4, Heading6 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card } from '@/components/ui/card';
import { getCurator } from '@/actions/curator.actions';
import { LocaleProps } from '@/types/locale-props';
import { getTranslations } from 'next-intl/server';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Show } from '@/components/utils/show';

const INTL_NAMESPACE = 'private.curator';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function CuratorPage() {
  const result = await getCurator();
  const { userInfo, subdivisions, contacts } = result;

  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-8 w-full px-2 sm:px-4 md:px-0">
        <Heading2>{t('title')}</Heading2>
        <Paragraph className="mb-7 mt-3 max-w-full text-sm font-normal leading-sm text-neutral-700 sm:max-w-2xl">
          {t('info')}
        </Paragraph>
        <Card className="rounded-b-6 col-span-full flex w-full flex-col gap-4 bg-white p-4 sm:gap-6 sm:p-6 md:p-9 xl:col-span-5">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <ProfilePicture size="xl" src={userInfo.photo || ''} />
            <Heading4 className="text-basic-black">{userInfo.fullName}</Heading4>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            <Heading6>{t('curator-info')}</Heading6>
            <hr />
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <Paragraph className="m-0 w-full text-lg font-semibold text-neutral-400 sm:w-[170px]">
                  {t('subdivisions')}
                </Paragraph>
                <div className="flex flex-1 flex-col gap-1 sm:gap-2">
                  {subdivisions?.map((subdivision) => (
                    <Paragraph key={subdivision.id} className="m-0 break-words text-lg font-normal text-basic-black">
                      {subdivision.name}
                    </Paragraph>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <Show when={contacts.length > 0}>
                  <Paragraph className="m-0 text-lg font-semibold text-neutral-400">{t('contacts')}</Paragraph>
                  {contacts?.map((contact, index) => (
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-6" key={index}>
                      <Paragraph className="m-0 w-full text-lg font-semibold text-neutral-400 sm:w-[170px] sm:pl-4">
                        {contact.name}
                      </Paragraph>
                      <Paragraph className="m-0 break-all text-lg font-normal text-basic-black">
                        {contact.value}
                      </Paragraph>
                    </div>
                  ))}
                </Show>
              </div>
              {userInfo.profile && (
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                  <Paragraph className="m-0 w-full text-lg font-semibold text-neutral-400 sm:w-[170px]">
                    {t('profile')}
                  </Paragraph>
                  <Paragraph className="m-0 flex-1 break-all text-lg font-normal text-basic-black">
                    <Link href={userInfo.profile} target="_blank" rel="noopener noreferrer">
                      {userInfo.profile}
                    </Link>
                  </Paragraph>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </SubLayout>
  );
}
