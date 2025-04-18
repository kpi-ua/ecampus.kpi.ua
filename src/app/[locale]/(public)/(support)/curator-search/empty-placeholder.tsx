interface EmptyPlaceholderProps {
  text: string;
}

export const EmptyPlaceholder = ({ text }: EmptyPlaceholderProps) => {
  return (
    <div className="absolute left-[50%] top-[50%] w-[50%] -translate-x-[50%] -translate-y-[50%] text-center text-neutral-500">
      <span>{text}</span>
    </div>
  );
};
