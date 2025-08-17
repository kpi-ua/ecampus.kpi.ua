import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { CertificateVerifier } from './certificate-verifier';
import { AuthNavLayout } from '@/app/[locale]/(public)/auth-nav-layout';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public.verification' });
  return { title: t('header') };
}

export default async function Verify({ params }: LocaleProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('public.verification');

  return (
    <AuthNavLayout header={t('header')} className="flex w-full grow flex-col items-start">
      <section className="mt-8 w-full text-lg leading-lg">
        <div className="flex w-full flex-col gap-6">
          <CertificateVerifier />
        </div>
      </section>
    </AuthNavLayout>
  );
}
