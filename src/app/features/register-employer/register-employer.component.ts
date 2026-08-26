import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  ApiErrorResponse,
  CreateCompanyEmployerDto,
  CreateEmployerDto,
  CreateGovernmentEmployerDto,
  CreateHouseholdEmployerDto,
  EmployerKind,
} from '../../Models/auth.model';

@Component({
  selector: 'app-register-employer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-employer.component.html',
  styleUrl: './register-employer.component.css',
})
export class RegisterEmployerComponent {
  // CHANGED: inject() instead of constructor params — see login.component.ts for why.
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessages = signal<string[]>([]);
  readonly selectedType = signal<EmployerKind>('Household');

  // Fields common to every employer type.
  readonly commonForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    city: ['', Validators.required],
    subCity: ['', Validators.required],
    woreda: ['', Validators.required],
    specialInstruction: [''],
  });

  // One form per subtype — only the active one is validated/submitted.
  readonly householdForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    nationalIdNumber: ['', Validators.required],
    numberOfFamilyMembers: [1, [Validators.required, Validators.min(1)]],
    hasPets: [false],
  });

  readonly companyForm = this.fb.group({
    companyName: ['', Validators.required],
    industry: ['', Validators.required],
    tradeLicenseNumber: ['', Validators.required],
    taxRegistrationNumber: ['', Validators.required],
    contactPersonName: ['', Validators.required],
    contactPersonRole: ['', Validators.required],
    companySize: [1, [Validators.required, Validators.min(1)]],
  });

  readonly governmentForm = this.fb.group({
    organizationName: ['', Validators.required],
    sector: ['', Validators.required],
    department: ['', Validators.required],
    authorizedOfficerName: ['', Validators.required],
    officialLetterRefNumber: ['', Validators.required],
  });

  selectType(type: EmployerKind): void {
    this.selectedType.set(type);
    this.errorMessages.set([]);
  }

  submit(): void {
    const typeForm = this.currentTypeForm();

    if (this.commonForm.invalid || typeForm.invalid) {
      this.commonForm.markAllAsTouched();
      typeForm.markAllAsTouched();
      return;
    }

    this.errorMessages.set([]);
    this.isSubmitting.set(true);

    const dto = this.buildDto();

    this.authService.registerEmployer(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessages.set(this.extractErrors(err));
      },
    });
  }

  private currentTypeForm() {
    switch (this.selectedType()) {
      case 'Household':
        return this.householdForm;
      case 'PrivateCompany':
        return this.companyForm;
      case 'GovernmentOrganization':
        return this.governmentForm;
    }
  }

  private buildDto(): CreateEmployerDto {
    const common = this.commonForm.getRawValue();
    const base = {
      email: common.email!,
      phoneNumber: common.phoneNumber!,
      password: common.password!,
      city: common.city!,
      subCity: common.subCity!,
      woreda: common.woreda!,
      specialInstruction: common.specialInstruction || undefined,
      employerType: this.selectedType(),
    };

    switch (this.selectedType()) {
      case 'Household': {
        const v = this.householdForm.getRawValue();
        const dto: CreateHouseholdEmployerDto = {
          $type: 'Household',
          ...base,
          firstName: v.firstName!,
          lastName: v.lastName!,
          nationalIdNumber: v.nationalIdNumber!,
          numberOfFamilyMembers: Number(v.numberOfFamilyMembers),
          hasPets: !!v.hasPets,
        };
        return dto;
      }
      case 'PrivateCompany': {
        const v = this.companyForm.getRawValue();
        const dto: CreateCompanyEmployerDto = {
          $type: 'PrivateCompany',
          ...base,
          companyName: v.companyName!,
          industry: v.industry!,
          tradeLicenseNumber: v.tradeLicenseNumber!,
          taxRegistrationNumber: v.taxRegistrationNumber!,
          contactPersonName: v.contactPersonName!,
          contactPersonRole: v.contactPersonRole!,
          companySize: Number(v.companySize),
        };
        return dto;
      }
      case 'GovernmentOrganization': {
        const v = this.governmentForm.getRawValue();
        const dto: CreateGovernmentEmployerDto = {
          $type: 'GovernmentOrganization',
          ...base,
          organizationName: v.organizationName!,
          sector: v.sector!,
          department: v.department!,
          authorizedOfficerName: v.authorizedOfficerName!,
          officialLetterRefNumber: v.officialLetterRefNumber!,
        };
        return dto;
      }
    }
  }

  private extractErrors(err: HttpErrorResponse): string[] {
    const body = err.error as ApiErrorResponse | undefined;
    if (body?.errors?.length) return body.errors;
    return [body?.errorMessage ?? body?.title ?? 'Registration failed. Please try again.'];
  }
}
