import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';

import { EmployerService } from '../../services/employer';
import { EmployerType } from '../../Models/enum/employer-type.enum';
import { IndustryType } from '../../Models/enum/industry-type.enum';
import { CompanySize } from '../../Models/enum/company-size.enum';
import { GovernmentSector } from '../../Models/enum/government-sector.enum';
import { CreateEmployerPayload } from '../../Models/employer.model';

@Component({
  selector: 'app-register-employer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-employer.component.html',
  styleUrl: './register-employer.component.scss'
})
export class RegisterEmployerComponent {
  private fb = inject(FormBuilder);
  private employerService = inject(EmployerService);
  private router = inject(Router);

  EmployerType = EmployerType;
  IndustryType = IndustryType;
  CompanySize = CompanySize;
  GovernmentSector = GovernmentSector;

  selectedEmployerType = signal<EmployerType | null>(null);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    // Base Fields
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^09[0-9]{8}$')]],
    city: ['Addis Ababa', Validators.required],
    subCity: ['', Validators.required],
    woreda: ['', Validators.required],
    specialInstructions: this.fb.array<FormControl<string>>([]),

    // Household
    firstName: [''],
    lastName: [''],
    nationalIdNumber: [''],
    numberOfFamilyMembers: [1],
    hasPets: [false],

    // Private Company
    companyName: [''],
    tradeLicenseNummber: [''],
    taxRegistrationNumber: [''],
    contactPersonName: [''],
    contactPersonRole: [''],
    industryType: [IndustryType.OtherCorporate as IndustryType],
    companySize: [CompanySize.Micro_1_To_10 as CompanySize],

    // Government Organization
    organizationName: [''],
    department: [''],
    authorizedOfficerName: [''],
    officialLetterNumber: [''],
    governmentSector: [GovernmentSector.AdministrativeAndMinistries as GovernmentSector]
  });

  get instructionsControls(): FormArray<FormControl<string>> {
    return this.form.controls.specialInstructions;
  }

  addInstruction(): void {
    this.instructionsControls.push(
      this.fb.control('', { nonNullable: true, validators: Validators.required })
    );
  }

  removeInstruction(index: number): void {
    this.instructionsControls.removeAt(index);
  }

  onSelectEmployerType(type: EmployerType): void {
    this.selectedEmployerType.set(type);
    this.clearDerivedValidators();

    if (type === EmployerType.Household) {
      this.form.controls.firstName.setValidators([Validators.required]);
      this.form.controls.lastName.setValidators([Validators.required]);
      this.form.controls.nationalIdNumber.setValidators([Validators.required]);
      this.form.controls.numberOfFamilyMembers.setValidators([Validators.required, Validators.min(1)]);

    } else if (type === EmployerType.PrivateCompany) {
      this.form.controls.companyName.setValidators([Validators.required]);
      this.form.controls.tradeLicenseNummber.setValidators([Validators.required]);
      this.form.controls.taxRegistrationNumber.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]);
      this.form.controls.contactPersonName.setValidators([Validators.required]);
      this.form.controls.contactPersonRole.setValidators([Validators.required]);
      this.form.controls.industryType.setValidators([Validators.required]);
      this.form.controls.companySize.setValidators([Validators.required]);

    } else if (type === EmployerType.GovernmentOrganization) {
      this.form.controls.organizationName.setValidators([Validators.required]);
      this.form.controls.department.setValidators([Validators.required]);
      this.form.controls.authorizedOfficerName.setValidators([Validators.required]);
      this.form.controls.officialLetterNumber.setValidators([Validators.required]);
      this.form.controls.governmentSector.setValidators([Validators.required]);
    }

    this.updateDerivedValidity();
  }

  submit(): void {
    if (this.form.invalid || this.selectedEmployerType() === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    const activeType = this.selectedEmployerType()!;

    const basePayload = {
      email: raw.email.trim(),
      phoneNumber: raw.phoneNumber.trim(),
      city: raw.city.trim(),
      subCity: raw.subCity.trim(),
      woreda: raw.woreda.trim(),
      specialInstructions: raw.specialInstructions.filter(i => i.trim() !== '')
    };

    let payload: CreateEmployerPayload;

    if (activeType === EmployerType.Household) {
      payload = {
        ...basePayload,
        employerType: EmployerType.Household,
        firstName: raw.firstName.trim(),
        lastName: raw.lastName.trim(),
        nationalIdNumber: raw.nationalIdNumber.trim(),
        numberOfFamilyMembers: Number(raw.numberOfFamilyMembers),
        hasPets: Boolean(raw.hasPets)
      };

    } else if (activeType === EmployerType.PrivateCompany) {
      payload = {
        ...basePayload,
        employerType: EmployerType.PrivateCompany,
        companyName: raw.companyName.trim(),
        tradeLicenseNummber: raw.tradeLicenseNummber.trim(),
        taxRegistrationNumber: raw.taxRegistrationNumber.trim(),
        contactPersonName: raw.contactPersonName.trim(),
        contactPersonRole: raw.contactPersonRole.trim(),
        industryType: Number(raw.industryType),
        companySize: Number(raw.companySize)
      };

    } else {
      payload = {
        ...basePayload,
        employerType: EmployerType.GovernmentOrganization,
        organizationName: raw.organizationName.trim(),
        department: raw.department.trim(),
        authorizedOfficerName: raw.authorizedOfficerName.trim(),
        officialLetterNumber: raw.officialLetterNumber.trim(),
        governmentSetor: Number(raw.governmentSector)
      };
    }

    this.employerService.registerEmployer(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/landing']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Registration failed. Please check inputs.');
      }
    });
  }

  private clearDerivedValidators(): void {
    const c = this.form.controls;

    c.firstName.clearValidators();
    c.lastName.clearValidators();
    c.nationalIdNumber.clearValidators();
    c.numberOfFamilyMembers.clearValidators();

    c.companyName.clearValidators();
    c.tradeLicenseNummber.clearValidators();
    c.taxRegistrationNumber.clearValidators();
    c.contactPersonName.clearValidators();
    c.contactPersonRole.clearValidators();
    c.industryType.clearValidators();
    c.companySize.clearValidators();

    c.organizationName.clearValidators();
    c.department.clearValidators();
    c.authorizedOfficerName.clearValidators();
    c.officialLetterNumber.clearValidators();
    c.governmentSector.clearValidators();
  }

  private updateDerivedValidity(): void {
    const c = this.form.controls;
    Object.keys(c).forEach(key => {
      c[key as keyof typeof c].updateValueAndValidity();
    });
  }
}