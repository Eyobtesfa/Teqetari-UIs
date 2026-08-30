import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerDash } from './employer-dash';

describe('EmployerDash', () => {
  let component: EmployerDash;
  let fixture: ComponentFixture<EmployerDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerDash],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerDash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
