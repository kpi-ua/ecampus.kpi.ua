import { Message } from "@/app/[locale]/(private)/module/msg/types";
import { campusFetch } from "@/lib/client";

export enum MailFilter {
    INCOMING = 'Incoming',
    OUTGOING = 'Outgoing',
}

export async function getMails(filter: MailFilter = MailFilter.INCOMING) {
    const response = await campusFetch<Message[]>(`/mail?filter=${filter}`);
    if (!response.ok) {
        throw new Error(`${response.status} Error`);
    }
    return response.json();
}

export async function deleteMail(id: number, deleteForRecipient: boolean) {
    await campusFetch<Message>(`/mail/${id}?deleteForRecipient=${deleteForRecipient}`, {
        method: 'DELETE',
    });
}