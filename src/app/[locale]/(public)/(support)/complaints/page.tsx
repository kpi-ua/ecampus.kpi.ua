import { useTranslations } from 'next-intl';
import { SupportLayout } from '../support-layout';

export default function Complaints() {
  const t = useTranslations('public.complaints');

  return (
    <SupportLayout header={t('header')} className="w-full grow">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSdlWaMSxcYVSfYDZpVgygSIl8reTZBM2Nl2ZzyuZzdaFwef_w/viewform?embedded=true"
        width="100%"
        height="950"
        className="-mx-[5%] w-[110%]"
      ></iframe>
    </SupportLayout>
  );
}
