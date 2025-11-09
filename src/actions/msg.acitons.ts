'use server';

import { Message } from '@/types/models/message';
import { campusFetch } from '@/lib/client';
import { MailFilter } from '@/types/enums/mail-filter';
import { Group } from '@/types/models/group';
import { Subdivision } from '@/types/models/subdivision';
import { revalidatePath } from 'next/cache';
import queryString from 'query-string';

export async function getMails(filter: MailFilter = MailFilter.Incoming) {
  const response = await campusFetch<Message[]>(`/mail?filter=${filter}`);
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export async function getMail(mailId: number) {
  const response = await campusFetch<Message>(`/mail/${mailId}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export async function getFacultyOptions() {
  const response = await campusFetch<Subdivision[]>('/mail/faculty-options');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export const getAllGroups = async () => {
  try {
    const response = await campusFetch<Group[]>('group/all');
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export async function deleteMail(mailIds: number[], deleteForRecipient: boolean) {
  const query = queryString.stringify(
    { mailIds: mailIds, deleteForRecipient: deleteForRecipient },
    { arrayFormat: 'none' },
  );

  await campusFetch<Message>(`/mail?${query}`, {
    method: 'DELETE',
  });

  revalidatePath('/module/msg');
}

export async function markAsImportant(mailIds: number[], isImportant: boolean) {
  const response = await campusFetch<Message>(`/mail/important`, {
    method: 'PATCH',
    body: JSON.stringify({ mailIds: mailIds, isImportant: isImportant }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  revalidatePath('/module/msg');
}

export async function getGroupOptions(facultyIds: number[]) {
  const query = queryString.stringify({ faculties: facultyIds }, { arrayFormat: 'none' });
  const response = await campusFetch<Group[]>(`/mail/group-options?${query}`);
  if (response.status < 200 || response.status >= 300) {
    return [];
  }
  return response.json();
}

export async function getStudentOptions(groups: number[]) {
  const query = queryString.stringify({ groups }, { arrayFormat: 'none' });
  const response = await campusFetch<{ id: number; name: string }[]>(`/mail/student-options?${query}`);
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export async function getEmployeeOptions(faculties: number[]) {
  const query = queryString.stringify({ faculties }, { arrayFormat: 'none' });
  const response = await campusFetch<{ id: number; name: string }[]>(`/mail/employee-options?${query}`);
  if (!response.ok) {
    return [];
  }
  return response.json();
}

type SendMailParams = {
  recipients: number[];
  subject: string;
  content: string;
};
export async function sendMail(params: SendMailParams) {
  const response = await campusFetch<Message>('/mail', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return true;
}
