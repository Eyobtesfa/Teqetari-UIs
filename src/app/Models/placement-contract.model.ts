import { EmployerResponse } from './employer.model';
import { EmployeeResponse } from './employee.model';

export interface PlacementContractResponse {
  id: number;
  startDate: string;
  endDate: string | null;
  salary: number;
  agencyCommissionPercentage: number;
  isActive: boolean;
  cancelledAt: string | null;
  employer: EmployerResponse;
  employee: EmployeeResponse;
}