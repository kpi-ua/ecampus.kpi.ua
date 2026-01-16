export interface Signatory {
  position: string;
  fullName: string;
}

export interface CertificateSignatory extends Signatory {
  id: number;
  subdivisionId: number;
  isActive: boolean;
  isDefault: boolean;
}
