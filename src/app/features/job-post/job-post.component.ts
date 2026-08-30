import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobPostService } from '../../services/job-post.service';
import { ApiErrorResponse, JOB_CATEGORY_OPTIONS, WORK_MODE_OPTION } from '../../Models/jobPost.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-job-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-post.html',
  styleUrl: './job-post.scss',
})
export class JobPostComponent{
  private fb = inject(FormBuilder);
  private jobPostService = inject(JobPostService);

  readonly categoryOptions = JOB_CATEGORY_OPTIONS;
  readonly workModeOptions = WORK_MODE_OPTION;
  readonly isSubmitting = signal(false);
  readonly errorMessages = signal<string[]>([]);
  readonly successMessages = signal<string | null>(null);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: [null as number | null, Validators.required],
    offeredSalaryMin: [0, [Validators.required, Validators.min(0)]],
    offeredSalaryMax: [0, [Validators.required, Validators.min(0)]],
    requiredSkills: [''], // comma-separated, split before submit
    location: ['', Validators.required],
    workMode: [null as number | null, Validators.required],
    minimumExperienceYears: [0, [Validators.required, Validators.min(0)]],
    expirationDate: ['', Validators.required],
  });


      submit(): void{
        if(this.form.invalid){
          this.form.markAllAsTouched();
          return;
        }

        this.errorMessages.set([]);
        this.successMessages.set(null);
        this.isSubmitting.set(true);

        const raw = this.form.getRawValue();

        this.jobPostService.postJob({
          title: raw.title!,
          description: raw.description!,
          category: raw.category!,
          offeredSalaryMin: Number(raw.offeredSalaryMin),
          offeredSalaryMax: Number(raw.offeredSalaryMax),
          requiredSkills: raw.requiredSkills
              ? raw.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
              : [],
          location: raw.location!,
          workMode: raw.workMode!,
          minimumExperienceYears : Number(raw.minimumExperienceYears),
          expirationDate: raw.expirationDate!
        })

        .subscribe({
        next: (created) => {
          this.isSubmitting.set(false);
          this.successMessages.set(`"${created.title}" was posted successfully.`);
          this.form.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessages.set(this.extractErrors(err));
        },
      });
      }
      private extractErrors(err: HttpErrorResponse): string[] {
    const body = err.error as ApiErrorResponse | undefined;
    if (Array.isArray(body?.errors)) return body.errors;
    if (body?.errors && typeof body.errors === 'object') {
      return Object.values(body.errors).flat();
    }
    return [body?.title ?? 'Failed to post job. Please try again.'];
  }
}
