import { EmployerType } from "./enum/employer-type.enum";
import { IndustryType } from "./enum/industry-type.enum";
import { CompanySize } from "./enum/company-size.enum";
import { GovernmentSector } from "./enum/government-sector.enum";
export interface CreateEmployer{
    email: string;
    phoneNumber: string;
    city: string;
    subCity: string;
    woreda: string;
    specialInstruction?: string[] | null;
    employerType: EmployerType;
}

export interface CreateHouseholdEmplloyer extends CreateEmployer{
    '$type' : 'Household';
    firstName: string;
    lastName: string;
    nationalIdNumber: string;
    numberOfFamilyMembers: number;
    hasPets?: boolean
    employerType: EmployerType.Household
}

export interface CreateCompanyEmployer extends CreateEmployer{
    '$type': 'PrivateCompany';
    companyName: string;
    tradeLicenseNumber: string;
    taxRegistrationNumber: string;
    contactPersonName: string;
    contactPersonRole: string;
    employerType: EmployerType.PrivateCompany;
    industry: IndustryType;
    companySize: CompanySize
}

export interface CreateGovernmentEmployer extends CreateEmployer{
    '$type': 'GovernmentOrganization';
    organizationName: string;
    department: string;
    authorizedOfficerName: string;
    officialLetterRefNumber: string;
    employerType: EmployerType.GovernmentOrganization;
    sector: GovernmentSector
}

export type CreateEmployerPayload = CreateHouseholdEmplloyer | CreateCompanyEmployer | CreateGovernmentEmployer;