import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseJob } from './browse-job';

describe('BrowseJob', () => {
  let component: BrowseJob;
  let fixture: ComponentFixture<BrowseJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseJob],
    }).compileComponents();

    fixture = TestBed.createComponent(BrowseJob);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
