import { campusFetch } from '@/lib/client';

type DeanCertificates = {
  id: number;
  publicKey: string;
  requestedBy: { userAccountId: 157674; fullName: 'Бугайов Дмитро Сергійович' };
  purpose: string;
  reason: string;
  created: Date;
  processed?: Date;
  received?: Date;
  status: 'Pending';
  type: 'StudyingCertificate';
  originalRequired: boolean;
  notes?: string;
};

export async function getFacultyCertificates() {
  const res = await campusFetch('/dean/certificates/requests');
  const data = await res.json();
  console.log(data);
}
