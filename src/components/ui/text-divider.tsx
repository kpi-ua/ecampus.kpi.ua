interface TextDividerProps {
  children: React.ReactNode;
}

export const TextDivider = ({ children }: TextDividerProps) => {
  return (
    <span className="before:bg-neutral-divider after:bg-neutral-divider my-4 flex w-full items-center text-center text-neutral-600 before:mr-2 before:h-px before:grow before:content-[''] after:ml-2 after:h-px after:grow after:content-['']">
      {children}
    </span>
  );
};
