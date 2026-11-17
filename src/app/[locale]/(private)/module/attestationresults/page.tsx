import { redirect } from '@/i18n/routing';

export default async function LegacyStudentAttestationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect({ href: '/module/student-attestation', locale });
}
