
export type JobCategory =
  | 'Maid'
  | 'ChildcareProvider'
  | 'Cook'
  | 'Gardener'
  | 'Chauffeur'
  | 'GeneralHouseholdHelper'
  | 'SecurityGuarding'
  | 'ElderlyCareProvider'
  | 'PetCareProvider';

export const JOB_CATEGORIES: JobCategory[] = [
  'Maid',
  'ChildcareProvider',
  'Cook',
  'Gardener',
  'Chauffeur',
  'GeneralHouseholdHelper',
  'SecurityGuarding',
  'ElderlyCareProvider',
  'PetCareProvider',
];

// The three employer subtypes, matching the $type discriminator values
// used by CreateEmployerDto's polymorphic deserialization on the backend.
export type EmployerKind = 'Household' | 'PrivateCompany' | 'GovernmentOrganization';

export interface LoginDto {
  identifier: string; // email for employers, phone number for employees
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  password: string;
  nationalIdNumber: string;
  city: string;
  subCity: string;
  woreda: string;
  yearsOfExperience: number;
  expectedSalary: number;
  jobCategory: JobCategory;
  skills?: string[];
}

// Common fields shared by every employer subtype.
export interface BaseEmployerFields {
  email: string;
  phoneNumber: string;
  password: string;
  city: string;
  subCity: string;
  woreda: string;
  specialInstruction?: string;
  employerType: EmployerKind;
}

export interface CreateHouseholdEmployerDto extends BaseEmployerFields {
  $type: 'Household';
  firstName: string;
  lastName: string;
  nationalIdNumber: string;
  numberOfFamilyMembers: number;
  hasPets?: boolean;
}

export interface CreateCompanyEmployerDto extends BaseEmployerFields {
  $type: 'PrivateCompany';
  companyName: string;
  industry: string;
  tradeLicenseNumber: string;
  taxRegistrationNumber: string;
  contactPersonName: string;
  contactPersonRole: string;
  companySize: number;
}

export interface CreateGovernmentEmployerDto extends BaseEmployerFields {
  $type: 'GovernmentOrganization';
  organizationName: string;
  sector: string;
  department: string;
  authorizedOfficerName: string;
  officialLetterRefNumber: string;
}

export type CreateEmployerDto =
  | CreateHouseholdEmployerDto
  | CreateCompanyEmployerDto
  | CreateGovernmentEmployerDto;

export interface ApiErrorResponse {
  errors?: string[];
  errorMessage?: string;
  title?: string;
}
