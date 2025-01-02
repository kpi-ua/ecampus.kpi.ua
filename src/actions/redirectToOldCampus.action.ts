'use server';
import { redirect } from 'next/navigation';

export async function redirectToOldCampus() {
  redirect(process.env.OLD_CAMPUS_URL!);
}
