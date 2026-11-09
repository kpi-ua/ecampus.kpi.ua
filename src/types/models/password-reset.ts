// The answers of the Campus API `account/recovery` the user can act on; any other answer is a server error.
export type PasswordResetOutcome = 'success' | 'user-not-found' | 'no-email' | 'captcha-failed';
