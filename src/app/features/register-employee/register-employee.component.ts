import { Component, inject, signal } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { EmployeeService } from "../../services/employee";
import { CreateEmployee } from "../../Models/employee.model";
import { JobCategory } from "../../Models/job-category.enum";


@Component({
  selector: 'app-register-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-employee.component.html'
})
export class RegisterEmployeeComponent{
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  jobCategories = [
  { value: JobCategory.Maid, label: 'Maid' },
  { value: JobCategory.ChildCareProvide, label: 'ChildCareProvider' },
  { value: JobCategory.Cook, label: 'Cook' },
  { value: JobCategory.Gardner, label: 'Gardner' },
  { value: JobCategory.Chauffeur, label: 'Chauffeur' },
  { value: JobCategory.GeneralHouseholdHelper, label: 'GeneralHouseholdHelper' },
  { value: JobCategory.SecurityGuarding, label: 'SecurityGuarding' },
  { value: JobCategory.ElderlyCareProvider, label: 'ElderlyCareProvider' },
  { value: JobCategory.PetCareProvider, label: 'PetCareProvider' },
];;

  form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required, Validators.pattern('^09[0-9]{8}$')]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    nationalIdNumber: ['', Validators.required],
    email: [''], // Optional
    city: ['Addis Ababa', Validators.required],
    subCity: ['', Validators.required],
    woreda: ['', Validators.required],
    yearsOfExperience: [1, [Validators.required, Validators.min(0)]],
    expectedSalary: [3000, [Validators.required, Validators.min(500)]],
    jobCategory: [JobCategory.Maid, Validators.required],
    skills: this.fb.array<FormControl<string>>([])
  });

  get skillsControls(){
    return this.form.controls.skills;
  }

  addSkills(){
    this.skillsControls.push(this.fb.control('',{ nonNullable: true, validators: Validators.required}));
  }

  removeSkill(index: number){
    this.skillsControls.removeAt(index);
  }
  submit(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
  
  // Format payload ensuring correct types and handling optional nullables
  const payload: CreateEmployee = {
    ...raw,
    email: raw.email?.trim() ? raw.email.trim() : null,
    skills: raw.skills?.length ? raw.skills : [],
    jobCategory: Number(raw.jobCategory) // Ensure numeric enum
  };

  this.employeeService.registerEmployee(payload).subscribe({
    next: () => {
      this.isSubmitting.set(false);
      this.router.navigate(['/landing']);
    },
     error: (err) => {
    this.isSubmitting.set(false);
    console.error('Validation errors:', err.error?.errors);

    // If ASP.NET returns validation errors, format and display them
    if (err.error?.errors) {
      const messages = Object.entries(err.error.errors)
        .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
        .join(' | ');
      this.errorMessage.set(`Validation Failed: ${messages}`);
    } else {
      this.errorMessage.set('Error (400): Bad request. Check console for details.');
    }
  }
    });
  }
}