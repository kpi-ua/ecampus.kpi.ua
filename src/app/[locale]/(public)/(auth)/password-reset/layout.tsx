'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function PasswordResetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || ''}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
