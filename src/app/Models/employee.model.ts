import { JobCategory } from "./enum/job-category.enum";
export interface CreateEmployee{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalIdNumber: string;
    email?: string | null;
    city: string;
    subCity: string;
    woreda: string;
    yearsOfExperience: number;
    expectedSalary: number;
    skills?: string[] | null;
    jobCategory: JobCategory;
}

export interface EmployeeResponse{
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalIdNumber: string;
    city: string;
    subCity: string;
    woreda: string;
    yearsOfExperience: number;
    expectedSalary: number;
    jobCategory: JobCategory;
    skills: string[];
    isAvailable: boolean;
    backgroundCheckPassed: boolean;
    registeredAt: string;
    totalApplicationCount: number;
}


export interface EmployeeFilterResponse{
    id: number;
    firstName: string;
    lastName: string;
    city: string;
    subCity: string;
    woreda: string;
    yearsOfExperience: number;
    expectedSalary: number;
    jobCategory: JobCategory;
    skills: string[];
    isAvailable: boolean;
    registeredAt: string;
}

export interface EmployeeFilter{
    category? : number | null;
    city? : string | null;
    minYearsOfExperience? : number | null;
    maxExpectedSalary? : number | null;
    minExpectedSalary? : number | null;
}