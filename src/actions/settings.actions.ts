'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { campusFetch } from '@/lib/client';
import { isKpiCorporateEmail } from '@/lib/email.utils';
import { fileUpload } from '@/lib/file-upload';

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
