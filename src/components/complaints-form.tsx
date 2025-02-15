interface ComplaintsFormProps {
  className?: string;
}
export function ComplaintsForm({ className }: ComplaintsFormProps) {
  return (
    <iframe src={process.env.NEXT_PUBLIC_COMPLAINTS_FORM!} width="100%" height="950" className={className}></iframe>
  );
}
