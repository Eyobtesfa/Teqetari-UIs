import { JobCategory } from "./enum/job-category.enum";
import { WorkMode } from "./enum/job-post.enum";
export interface CreateJobPost{
    title : string;
    description: string;
    category: JobCategory;
    offeredSalaryMin: number;
    offeredSalaryMax: number;
    requiredSkills: string[];
    location: string;
    minimumExperienceYears: number;
    workMode: WorkMode;
    expirationDate: string;
}

export const JOB_CATEGORY_OPTIONS =[
    {value: JobCategory.Maid, label: 'Maid'},
    {value: JobCategory.Chauffeur, label: 'Chauffeur'},
    {value: JobCategory.ChildCareProvider, label: 'ChildCareProvider'},
    { value: JobCategory.Cook, label: 'Cook' },
    { value: JobCategory.Gardener, label: 'Gardener' },
    { value: JobCategory.GeneralHouseholdHelper, label: 'General Household Helper' },
    { value: JobCategory.SecurityGuarding, label: 'Security Guarding' },
    { value: JobCategory.ElderlyCareProvider, label: 'Elderly Care Provider' },
    { value: JobCategory.PetCareProvider, label: 'Pet Care Provider' },
]

export const WORK_MODE_OPTION =[
    { value: WorkMode.DayLabourer, label: 'DayLabourer'},
    { value: WorkMode.Permanent, label: 'Permanent'}
]

export interface JobPostResponse{
    id : number;
    employerId: number;
    title : string;
    description : string;
    jobCategory: JobCategory;
    requiredSkills: string[];
    offeredSalaryMin: number;
    offeredSalaryMax: number;
    location: string;
    workMode: WorkMode;
    minimumExperienceYears: number;
    postedAt: string;
    expirationDate: string;
}

export interface ApiErrorResponse {
    errors?: Record<string, string[]> | string[];
    title?: string;
}