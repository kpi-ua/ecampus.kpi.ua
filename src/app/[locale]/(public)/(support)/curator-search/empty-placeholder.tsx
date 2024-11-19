interface EmptyPlaceholderProps {
  text: string;
}

export const EmptyPlaceholder = ({ text }: EmptyPlaceholderProps) => {
  return (
    <div className="w-[50%] text-center absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] text-neutral-500">
      <span>{text}</span>
    </div>
  );
};
