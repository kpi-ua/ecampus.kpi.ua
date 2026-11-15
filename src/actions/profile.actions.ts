'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { campusFetch } from '@/lib/client';
import { USER_PROFILE_CACHE_TAG } from '@/lib/constants/common';
import { Contact, ContactType } from '@/types/models/contact';

export async function getContacts() {
  try {
    const response = await campusFetch<Contact[]>('profile/contacts');

    return response.json();
  } catch (error) {
    return [];
  }
}

export async function getContactTypes() {
  try {
    const response = await campusFetch<ContactType[]>('profile/contacts/types');

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

    updateTag(USER_PROFILE_CACHE_TAG);
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

    updateTag(USER_PROFILE_CACHE_TAG);
  } catch (error) {
    throw new Error('Error while updating contact');
  }
}

export async function deleteContact(id: number) {
  try {
    await campusFetch(`profile/contacts/${id}`, {
      method: 'DELETE',
    });

    updateTag(USER_PROFILE_CACHE_TAG);
  } catch (error) {
    throw new Error('Error while deleting contact');
  }
}

export async function updateIntellectInfo(credo: string, scientificInterests: string) {
  try {
    await campusFetch('profile/intellect', {
      method: 'PUT',
      body: JSON.stringify({ credo, scientificInterests }),
    });
    updateTag(USER_PROFILE_CACHE_TAG);
  } catch (error) {
    throw new Error('Error while updating intellect info');
  }
}

export async function acceptCodeOfHonor() {
  try {
    await campusFetch('profile/code-of-honor', {
      method: 'PUT',
    });
  } catch (error) {
    throw new Error('Error while accepting code of honor');
  }
  redirect('/');
}

export async function acceptPrivacyConsent() {
  try {
    await campusFetch('profile/privacy-consent', {
      method: 'POST',
    });
    updateTag(USER_PROFILE_CACHE_TAG);
  } catch (error) {
    throw new Error('Error while accepting privacy consent');
  }
}
