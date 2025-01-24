import { AnnouncementCard } from './announcement-card';

export const DefaultAnnouncement = () => {
  return (
    <AnnouncementCard
      title={
        <>
          Ви увійшли до системи <span className="text-brand-700">«Електронний Кампус»</span>
        </>
      }
      description="Тут можна знайти методичне забезпечення до навчальних дисциплін, результати поточного контролю, новини
            навчального процесу та іншу важливу інформацію."
      image="/images/Saly-10.png"
    />
  );
};
