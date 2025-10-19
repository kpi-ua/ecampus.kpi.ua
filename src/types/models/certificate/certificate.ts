import { CertificateStatus } from '@/types/models/certificate/status';

export interface Certificate {
  id: number;
  publicKey: string;
  requestedBy: { userAccountId: number; fullName: string };
  purpose: string;
  reason: string;
  approved: boolean | null;
  created: Date;
  updatedAt: Date;
  processed?: Date;
  received?: Date;
  status: CertificateStatus;
  type: string;
  originalRequired: boolean;
  notes?: string;
  documentNumber: string;
}
