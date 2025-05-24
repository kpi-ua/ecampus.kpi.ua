import Image from 'next/image';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Heading4, Heading6 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card } from '@/components/ui/card';
import { getCurator } from '@/actions/kurator.actions';
import { LocaleProps } from '@/types/locale-props';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'private.kurator' });

  return {
    title: t('title'),
  };
}

export default async function CuratorPage() {
  const result = await getCurator();
  const { userInfo, subdivisions, contacts } = result;
  const photoUrl = result.userInfo?.photo || null;

  const t = await getTranslations('private.kurator');

  return (
    <SubLayout pageTitle="Куратор">
      <div className="col-span-8">
        <Heading2>{t('title')}</Heading2>
        <Paragraph className="mb-[28px] mt-[12px] w-[624px] text-sm font-normal leading-sm text-neutral-700">
          <Paragraph>{t('info')}</Paragraph>
        </Paragraph>
        <Card className="rounded-b-6 col-span-full flex w-full flex-col gap-[24px] bg-white p-[36px] xl:col-span-5">
          <div className="flex items-center gap-[24px]">
            <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-brand-100">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={`${userInfo.fullName} photo`}
                  className="h-full w-full object-cover"
                  width={120}
                  height={120}
                />
              ) : (
                <Heading3 className="text-basic-green">{userInfo?.fullName?.[0] || 'К'}</Heading3>
              )}
            </div>
            <Heading4 className="text-basic-black">{userInfo?.fullName}</Heading4>
          </div>
          <div className="flex flex-col gap-[12px]">
            <Heading6>{t('curator-info')}</Heading6>
            <hr />
            <div className="flex flex-col gap-[16px]">
              <div className="flex gap-[24px]">
                <Paragraph className="m-0 w-[170px] text-lg font-semibold text-neutral-400">
                  {t('subdivisions')}
                </Paragraph>
                <div className="flex flex-col gap-[8px]">
                  {subdivisions?.map((s) => (
                    <Paragraph key={s.id} className="m-0 text-lg font-normal text-basic-black">
                      {s.name}
                    </Paragraph>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <Paragraph className="m-0 text-lg font-semibold text-neutral-400">{t('contacts')}</Paragraph>
                {contacts?.map((c, idx) => (
                  <div className="flex gap-[24px]" key={idx}>
                    <Paragraph className="m-0 w-[170px] pl-[16px] text-lg font-semibold text-neutral-400">
                      {c.name}
                    </Paragraph>
                    <Paragraph className="m-0 text-lg font-normal text-basic-black">{c.value}</Paragraph>
                  </div>
                ))}
              </div>
              <div className="flex gap-[24px]">
                <Paragraph className="m-0 w-[170px] text-lg font-semibold text-neutral-400">{t('profile')}</Paragraph>
                <Paragraph className="m-0 text-lg font-normal text-basic-black">
                  <a href={userInfo.profile || '#'} target="_blank" rel="noopener noreferrer">
                    {userInfo.profile || '—'}
                  </a>
                </Paragraph>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </SubLayout>
  );
}
