interface SuggestionsFormProps {
  className?: string;
}
export function SuggestionsForm({ className }: SuggestionsFormProps) {
  return (
    <iframe src={process.env.NEXT_PUBLIC_SUGGESTIONS_FORM!} width="100%" height="950" className={className}></iframe>
  );
}
