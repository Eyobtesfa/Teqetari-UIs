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
    specialInstructions?: string[] | null;
    employerType: EmployerType;
}

export interface CreateHouseholdEmplloyer extends CreateEmployer{
    firstName: string;
    lastName: string;
    nationalIdNumber: string;
    numberOfFamilyMembers: number;
    hasPets?: boolean
    employerType: EmployerType.Household
}

export interface CreateCompanyEmployer extends CreateEmployer{
    companyName: string;
    tradeLicenseNummber: string;
    taxRegistrationNumber: string;
    contactPersonName: string;
    contactPersonRole: string;
    employerType: EmployerType.PrivateCompany;
    industryType: IndustryType;
    companySize: CompanySize
}

export interface CreateGovernmentEmployer extends CreateEmployer{
    organizationName: string;
    department: string;
    authorizedOfficerName: string;
    officialLetterNumber: string;
    employerType: EmployerType.GovernmentOrganization;
    governmentSetor: GovernmentSector
}

export type CreateEmployerPayload = CreateHouseholdEmplloyer | CreateCompanyEmployer | CreateGovernmentEmployer;