export interface CreateHireRequest{
    employeeId: number;
    offeredSalary: number;
    message?: string;
    startDateFrom: string;
    startDateTo: string;
}

export enum HireRequestStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
}

export interface HireRequestResponse{
    id: number;
    employerId: number;
    employeeId: number;
    offeredSalary: number;
    message: string;
    startDateFrom: string;
    startDateTo: string;
    requestedAt: string;
    respondedAt: string | null;
    declineReason: string | null;
    status: HireRequestStatus
}

export interface RespondToHireRequest {
  accept: boolean;
  chosenStartDate?: string;
  chosenEndDate?: string;
  agencyCommissionPercentage?: number;
  declineReason?: string;
}


export interface ApiErrorResponse {
  errors?: string[];
  error?: string;
  title?: string;
}
