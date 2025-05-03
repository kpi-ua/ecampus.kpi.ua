'use client';

// FIXME:
// This version of recaptcha library should be replace with official one,
// when it starts to support React 19
import { GoogleReCaptchaProvider } from 'react19-google-recaptcha-v3';

interface Props
  extends Readonly<{
    children: React.ReactNode;
  }> {}

export default function PasswordResetLayout({ children }: Props) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || ''}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
