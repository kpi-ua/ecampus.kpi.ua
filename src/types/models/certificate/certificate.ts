import { CertificateStatus } from '@/types/models/certificate/status';

export interface Certificate {
  id: number;
  publicKey: string;
  requestedBy: {
    userAccountId: number;
    fullName: string;
  };
  purpose: string;
  created: Date;
  processed?: Date;
  status: CertificateStatus;
  type: string;
}
