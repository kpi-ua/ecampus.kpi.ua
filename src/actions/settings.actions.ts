'use server';

import { revalidatePath, updateTag } from 'next/cache';
import * as z from 'zod';

import { campusFetch } from '@/lib/client';
import { USER_PROFILE_CACHE_TAG } from '@/lib/constants/common';
import { isKpiCorporateEmail } from '@/lib/email.utils';
import { fileUpload } from '@/lib/file-upload';
import { EmailConfirmationResult } from '@/types/models/link-confirmation';

const corporateEmailSchema = z.string().trim().email().refine(isKpiCorporateEmail);

export async function changeEmail(email: string) {
  const validatedEmail = corporateEmailSchema.parse(email);
  const response = await campusFetch('settings/email', {
    method: 'PUT',
    body: JSON.stringify({ email: validatedEmail }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  revalidatePath('/settings');
}

export async function confirmEmail(code: string): Promise<EmailConfirmationResult> {
  const response = await campusFetch('settings/email/validate', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });

  if (response.ok) {
    updateTag(USER_PROFILE_CACHE_TAG);
    return 'success';
  }

  if (response.status === 400) {
    return 'invalid';
  }

  if (response.status === 429) {
    return 'too-many-attempts';
  }

  throw new Error(`${response.status} Error`);
}

export async function changePhoto(formData: FormData) {
  await fileUpload('profile/photo', formData);
  revalidatePath('/');
}

export async function changePassword(password: string, currentPassword: string) {
  const response = await campusFetch('settings/password', {
    method: 'PUT',
    body: JSON.stringify({ password, currentPassword }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
}
