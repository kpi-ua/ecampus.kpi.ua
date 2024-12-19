import Greeting from './greeting';
import { MainCard } from './main-card';
import { NotificationsCard } from './notifications-card';
import { SocialNetworksCard } from './social-networks-card';
import { SupportCard } from './support-card';

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-8 xl:grid-cols-12">
      <Greeting className="col-span-full" />
      <MainCard className="col-span-full md:col-span-4 lg:col-span-full xl:col-span-8" />
      <NotificationsCard className="x:col-span-2 col-span-full md:col-span-4 lg:col-span-4 lg:row-span-2 xl:row-span-2" />
      <SocialNetworksCard className="col-span-full md:col-span-4 lg:col-span-4" />
      <SupportCard className="col-span-full md:col-span-4 lg:col-span-4" />
    </div>
  );
}
