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
      <a className="block my-1 text-xl" href={link} target="_blank">{curatorName}</a>
      <span className="my-1 text-base text-neutral-600">{department}</span>
    </div>
  );
};
