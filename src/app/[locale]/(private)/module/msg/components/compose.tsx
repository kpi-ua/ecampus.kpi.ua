import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heading4 } from '@/components/typography';
import { getAllGroups } from '@/actions/msg.actions';
import { Individual } from '@/app/[locale]/(private)/module/msg/components/individual';
import { Broadcast } from '@/app/[locale]/(private)/module/msg/components/broadcast';
import { getTranslations } from 'next-intl/server';
import { ProfileArea } from '@/types/enums/profile-area';

interface Props {
  profileArea: ProfileArea;
}

export default async function Compose({ profileArea }: Props) {
  const groupOptions = await getAllGroups();
  const t = await getTranslations('private.msg.compose');
  const isEmployee = profileArea === ProfileArea.Employee;

  return (
    <div className="w-full">
      <Heading4 className="mb-6">{t('title')}</Heading4>

      <Tabs defaultValue="individual" className="mb-6 w-full">
        <TabsList>
          <TabsTrigger value="individual">{t('individual')}</TabsTrigger>
          {isEmployee && <TabsTrigger value="broadcast">{t('broadcast')}</TabsTrigger>}
        </TabsList>

        <TabsContent value="individual" className="mt-6 space-y-6">
          <Individual groupOptions={groupOptions} />
        </TabsContent>

        {isEmployee && (
          <TabsContent value="broadcast" className="mt-6">
            <Broadcast groupOptions={groupOptions} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
