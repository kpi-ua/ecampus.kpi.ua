'use server';

import { Contact, ContactType } from '@/types/contact';
import { campusFetch } from '@/lib/client';
import { revalidatePath } from 'next/cache';
import { getUserDetails } from '@/actions/auth.actions';

export async function getContacts(): Promise<Contact[]> {
  try {
    const response = await campusFetch('profile/contacts');

    return response.json();
  } catch (error) {
    return [];
  }
}

export async function getContactTypes(): Promise<ContactType[]> {
  try {
    const response = await campusFetch('profile/contacts/types');

    return response.json();
  } catch (error) {
    return [];
  }
}

export async function createContact(typeId: number, value: string) {
  try {
    await campusFetch('profile/contacts', {
      method: 'POST',
      body: JSON.stringify({ typeId, value }),
    });
    revalidatePath('/profile');
  } catch (error) {
    throw new Error('Error while creating contact');
  }
}

export async function updateContact(id: number, typeId: number, value: string) {
  try {
    await campusFetch(`profile/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ typeId, value }),
    });
    revalidatePath('/profile');
  } catch (error) {
    throw new Error('Error while updating contact');
  }
}

export async function deleteContact(id: number) {
  try {
    await campusFetch(`profile/contacts/${id}`, {
      method: 'DELETE',
    });
    revalidatePath('/profile');
  } catch (error) {
    throw new Error('Error while deleting contact');
  }
}

export async function setIntellectAgreement(agree: boolean) {
  try {
    await campusFetch('profile/intellect/agreement', {
      method: 'POST',
      body: JSON.stringify({ agree }),
    });
    return await getUserDetails();
  } catch (error) {
    throw new Error('Error while setting intellect agreement');
  }
}

export async function updateEnglishFullName(fullNameEnglish: string) {
  try {
    await campusFetch('profile', {
      method: 'PUT',
      body: JSON.stringify({ fullNameEnglish }),
    });
    return await getUserDetails();
  } catch (error) {
    throw new Error('Error while updating English full name');
  }
}

export async function updateIntellectInfo(credo: string, scientificInterests: string) {
  try {
    await campusFetch('profile/intellect', {
      method: 'PUT',
      body: JSON.stringify({ credo, scientificInterests }),
    });
    return await getUserDetails();
  } catch (error) {
    throw new Error('Error while updating intellect info');
  }
}

export async function acceptCodeOfHonor() {
  try {
    await campusFetch('profile/code-of-honor', {
      method: 'PUT',
      body: JSON.stringify({ agree: true }),
    });
    return await getUserDetails();
  } catch (error) {
    throw new Error('Error while accepting code of honor');
  }
}
