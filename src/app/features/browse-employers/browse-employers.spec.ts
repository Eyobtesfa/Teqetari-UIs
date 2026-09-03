import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseEmployersComponent } from './browse-employers';

describe('BrowseEmployers', () => {
  let component: BrowseEmployersComponent;
  let fixture: ComponentFixture<BrowseEmployersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseEmployersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrowseEmployersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
