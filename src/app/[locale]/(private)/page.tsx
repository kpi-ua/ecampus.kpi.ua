import Greeting from './greeting';
import { AnnouncementsCard, InformationCard, SocialNetworksCard, SupportCard } from './cards';

export default function Home() {
  return (
    <div className="grid auto-rows-max grid-cols-12 gap-[20px] lg:auto-rows-auto">
      <Greeting className="col-span-full" />
      <AnnouncementsCard className="col-span-full w-full 2xl:col-span-8" />
      <InformationCard className="3xl:col-span-3 col-span-full lg:col-span-6 lg:row-span-2 xl:col-span-4 xl:row-span-2" />
      <SocialNetworksCard className="col-span-full lg:col-span-6 xl:col-span-4" />
      <SupportCard className="col-span-full lg:col-span-6 xl:col-span-4" />
    </div>
  );
}
