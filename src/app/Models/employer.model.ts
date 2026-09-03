// employer-response.model.ts
import { EmployerType } from './enum/employer-type.enum';
import { IndustryType } from './enum/industry-type.enum';
import { CompanySize } from './enum/company-size.enum';
import { GovernmentSector } from './enum/government-sector.enum';

interface EmployerBaseResponse {
  id: number;
  type: EmployerType;
  email: string;
  phoneNumber: string;
  city: string;
  subCity: string;
  woreda: string;
  specialInstruction?: string[] | null;
  jobPostsCount: number;
  placementContractsCount: number;
}

export interface HouseholdResponse extends EmployerBaseResponse {
  '$type': 'Household';
  firstName: string;
  lastName: string;
  fullName: string;
  nationalIdNumber: string;
  numberOfFamilyMembers: number;
  hasPets: boolean;
}

export interface PrivateCompanyResponse extends EmployerBaseResponse {
  '$type': 'PrivateCompany';
  industry: IndustryType;
  companyName: string;
  tradeLicenseNumber: string;
  taxRegistrationNumber?: string;
  contactPersonName: string;
  contactPersonRole: string;
  size: CompanySize;
}

export interface GovernmentOrganizationResponse extends EmployerBaseResponse {
  '$type': 'GovernmentOrganization';
  organizationName: string;
  sector: GovernmentSector;
  department: string;
  authorizedOfficerName: string;
  officialLetterRefNumber: string;
}

export type EmployerResponse =
  | HouseholdResponse
  | PrivateCompanyResponse
  | GovernmentOrganizationResponse;