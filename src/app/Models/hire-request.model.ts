export interface CreateHireRequest{
    employeeId: number;
    offeredSalary: number;
    message?: string;
    startDateFrom: string;
    startDateTo: string;
}

export enum HireRequestStatus {
  Pending = 1,
  Accepted = 2,
  Declined = 3,
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


export interface ApiErrorResponse {
  errors?: string[];
  error?: string;
  title?: string;
}
