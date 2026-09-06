import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerDashboardComponent } from './employer-dash.component';

describe('EmployerDashboardComponent', () => {
  let component: EmployerDashboardComponent;
  let fixture: ComponentFixture<EmployerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
