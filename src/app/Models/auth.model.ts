export interface TeqetariUser {
  id: number;
  displayName: string;
  role: 'Employee' | 'Employer';
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}