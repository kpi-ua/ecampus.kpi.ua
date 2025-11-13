'use server';

import { Message } from '@/types/models/message';
import { campusFetch } from '@/lib/client';
import { MailFilter } from '@/types/enums/mail-filter';
import { Group } from '@/types/models/group';
import { revalidatePath } from 'next/cache';
import queryString from 'query-string';
import { EntityIdName } from '@/types/models/entity-id-name';

export async function getMails(filter: MailFilter = MailFilter.Incoming) {
  const response = await campusFetch<Message[]>(`/mail?filter=${filter}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getMail(mailId: number) {
  const response = await campusFetch<Message>(`/mail/${mailId}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getFacultyOptions() {
  const response = await campusFetch<EntityIdName[]>('/mail/faculty-options');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getAllGroups() {
  const allFaculties = await getFacultyOptions();
  const allFacultiesIds = allFaculties.map((faculty) => faculty.id);
  const query = queryString.stringify({ faculties: allFacultiesIds }, { arrayFormat: 'none' });
  const response = await campusFetch<EntityIdName[]>(`/mail/group-options?${query}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}

export async function deleteMail(mailIds: number[], deleteForRecipient: boolean) {
  const query = queryString.stringify(
    { mailIds: mailIds, deleteForRecipient: deleteForRecipient },
    { arrayFormat: 'none' },
  );

  const response = await campusFetch<Message>(`/mail?${query}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

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
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}

export async function getStudentOptions(groups: number[]) {
  const query = queryString.stringify({ groups }, { arrayFormat: 'none' });
  const response = await campusFetch<EntityIdName[]>(`/mail/student-options?${query}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getEmployeeOptions(search: string) {
  const response = await campusFetch<EntityIdName[]>(`/mail/employee-options?search=${search}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
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
