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

/**
 * Signatory from Dean DB returned by /certificates/signatories/student/{id}
 */
export interface DeanSignatory {
  name?: string;
  position?: string;
  employeeId?: number;
}
