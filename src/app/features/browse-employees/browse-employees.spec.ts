import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseEmployees } from './browse-employees';

describe('BrowseEmployees', () => {
  let component: BrowseEmployees;
  let fixture: ComponentFixture<BrowseEmployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseEmployees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseEmployees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
