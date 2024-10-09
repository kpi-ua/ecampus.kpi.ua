interface TextDividerProps {
  children: React.ReactNode;
}

export const TextDivider = ({ children }: TextDividerProps) => {
  return (
    <span className="my-6 flex items-center font-semibold text-neutral-600 text-center w-[100%] before:bg-neutral-divider before:content-[''] before:flex-grow before:h-[1px] before:mr-2 after:bg-neutral-divider after:content-[''] after:flex-grow after:h-[1px] after:ml-2">{children}</span>
  );
};
