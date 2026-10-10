export type RegistrationCodeType = 0 | 1; // 0=StudentRegistration, 1=TeacherJoin

export const REGISTRATION_CODE_TYPE = {
  StudentRegistration: 0,
  TeacherJoin: 1,
} as const;

export interface OrganizationDTO {
  id: string;
  name: string;
  createdAt: string;
}

export interface OrganizationTeacherDTO {
  id: string;
  teacherId: string;
  name: string;
  email: string;
  avatar?: string;
  canViewAllStudents: boolean;
  joinedAt: string;
}

export interface RegistrationCodeDTO {
  id: string;
  code: string;
  type: number;
  organizationId?: string | null;
  teacherId?: string | null;
  expiresAt: string;
  createdAt: string;
  isUsed: boolean;
  usedAt?: string | null;
}

export interface CreateOrganizationRequest {
  name: string;
}

export interface JoinOrganizationRequest {
  code: string;
}

export interface GenerateCodeRequest {
  expiresInDays?: number;
}

export interface UpdateVisibilityRequest {
  canViewAllStudents: boolean;
}

export interface MyOrganizationResponse {
  organization: OrganizationDTO;
  canViewAllStudents: boolean;
}

export interface ValidateCodeResponse {
  valid: boolean;
  type?: number | null;
  organizationId?: string | null;
  teacherId?: string | null;
  expiresAt?: string | null;
}

// Kod alfabesi: A-Z (I, O haric) + 2-9
export const CODE_ALPHABET_REGEX = /^[A-HJ-NP-Z2-9]{8}$/;

export function normalizeRegistrationCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function isValidRegistrationCode(raw: string): boolean {
  return CODE_ALPHABET_REGEX.test(normalizeRegistrationCode(raw));
}
