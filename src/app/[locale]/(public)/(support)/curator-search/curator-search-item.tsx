interface CuratorSearchItemProps {
  group: string;
  department: string;
  curatorName: string;
  link: string;
}

export const CuratorSearchItem = ({ group, department, curatorName, link }: CuratorSearchItemProps) => {
  return (
    <div className="[&:not(:last-child)]:mb-4 [&:not(:last-child)]:border-b-[1px] border-solid border-neutral-divider [&:not(:last-child)]:pb-4">
      <strong className="block my-1 text-lg">{group}</strong>
      <strong className="block my-1 text-xl">{curatorName}</strong>
      <span className="my-1 text-base text-neutral-600">{department}</span>
    </div>
  );
};
