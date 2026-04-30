import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { getSbpLoads, getSbpStudyYears, getSbpSubdivisions } from '@/actions/sbp-rights.actions';
import { getJWTPayload } from '@/lib/jwt';
import { TOKEN_COOKIE_NAME } from '@/lib/constants/cookies';
import { CampusJwtPayload } from '@/types/campus-jwt-payload';
import { LocaleProps } from '@/types/locale-props';
import { AccessDeniedState } from '../components/access-denied-state';
import { GrantForm } from '../components/grant-form';

const INTL_NAMESPACE = 'private.studbonuspointsrights.grant';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function GrantSbpRightsPage() {
  const t = await getTranslations(INTL_NAMESPACE);

  const cookieStore = await cookies();
  const jwt = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  const jwtPayload = jwt ? getJWTPayload<CampusJwtPayload>(jwt) : null;
  const isSuperAdmin = jwtPayload?.modules?.includes('studbonuspointsrights') ?? false;

  if (!isSuperAdmin) {
    return <AccessDeniedState />;
  }

  const [loads, subdivisions, years] = await Promise.all([
    getSbpLoads(),
    getSbpSubdivisions(),
    getSbpStudyYears(),
  ]);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 space-y-6">
        <div>
          <Heading2>{t('title')}</Heading2>
          <Description>{t('description')}</Description>
        </div>
        <GrantForm loads={loads} subdivisions={subdivisions} years={years} />
      </div>
    </SubLayout>
  );
}
