import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { LocaleProps } from '@/types/locale-props';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const INTL_NAMESPACE = 'private.msg';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function MessagePage() {
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-7">
        <Heading2>{t('title')}</Heading2>
        <Card className="mt-8 w-full bg-white">
          <CardContent className="flex flex-col gap-8 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="max-w-2xl">
              <Heading2 className="text-2xl lg:text-3xl">{t('archived.title')}</Heading2>
              <Paragraph className="text-basic-black m-0 text-sm leading-5">{t('archived.description')}</Paragraph>
              <Paragraph className="text-basic-black m-0 mt-3 text-sm leading-5">
                {t('archived.email-description')}
              </Paragraph>
              <Link href={process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_LINK!} target="_blank" rel="noopener noreferrer">
                <Button className="mt-8" size="big">
                  {t('archived.support')}
                </Button>
              </Link>
            </div>
            <div className="text-basic-blue flex shrink-0 justify-center lg:w-56">
              <Image src="/images/message-archived-cat.svg" alt="cat" width={220} height={150} />
            </div>
          </CardContent>
        </Card>
      </div>
    </SubLayout>
  );
}
