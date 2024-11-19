interface FieldProps {
  children: React.ReactNode;
}

export const Field = ({ children }: FieldProps) => {
  return (
    <div className="grid items-center w-full gap-2 my-6">
      {children}
    </div>
  );
};
