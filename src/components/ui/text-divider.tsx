interface TextDividerProps {
  children: React.ReactNode;
}

export const TextDivider = ({ children }: TextDividerProps) => {
  return (
    <span className="my-4 flex w-[100%] items-center text-center text-neutral-600 before:mr-2 before:h-[1px] before:flex-grow before:bg-neutral-divider before:content-[''] after:ml-2 after:h-[1px] after:flex-grow after:bg-neutral-divider after:content-['']">
      {children}
    </span>
  );
};
