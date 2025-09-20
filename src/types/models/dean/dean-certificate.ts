import { DeanCertificateStatus } from '@/types/enums/dean/certificate-status';

export type DeanCertificate = {
  id: number;
  publicKey: string;
  requestedBy: { userAccountId: number; fullName: string };
  purpose: string;
  reason: string;
  created: Date;
  processed?: Date;
  received?: Date;
  status: DeanCertificateStatus;
  type: string;
  originalRequired: boolean;
  notes?: string;
};
