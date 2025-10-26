'use server';

import { Subdivision } from '@/app/[locale]/(private)/module/msg/components/compose';
import { Message } from '@/app/[locale]/(private)/module/msg/types';
import { campusFetch } from '@/lib/client';
import { Group } from '@/types/models/group';
import queryString from 'query-string';

export enum MailFilter {
  INCOMING = 'Incoming',
  OUTGOING = 'Outgoing',
  IMPORTANT = 'Important',
}

export async function getMails(filter: MailFilter = MailFilter.INCOMING) {
  const response = await campusFetch<Message[]>(`/mail?filter=${filter}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
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

export async function deleteMail(id: number, deleteForRecipient: boolean) {
  await campusFetch<Message>(`/mail/${id}?deleteForRecipient=${deleteForRecipient}`, {
    method: 'DELETE',
  });
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
  console.log(query);
  const response = await campusFetch<{ id: number; name: string }[]>(`/mail/student-options?${query}`);
  console.log(response);
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
