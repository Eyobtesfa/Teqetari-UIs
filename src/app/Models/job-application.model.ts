import { JobCategory } from './enum/job-category.enum';
export enum ApplicationStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
}

export interface CreateJobApplication {
  jobPostId: number;
  coverMessage?: string;
}

export interface JobApplicationResponse {
  id: number;
  employeeId: number;
  appliedAt: string;
  jobPostId: number;
  jobTitle: string;
  coverLetter: string | null;
  status: ApplicationStatus;

    employeeFirstName: string;
  employeeLastName: string;
  employeeCity: string | null;
  employeeJobCategory: JobCategory;
  employeeYearsOfExperience: number | null;
  employeeExpectedSalary: number | null;
}


export interface RespondToJobApplication {
  accept: boolean;
  chosenStartDate?: string;
  chosenEndDate?: string;
  agreedSalary?: number;
  agencyCommissionPercentage?: number;
  declineReason?: string;
}