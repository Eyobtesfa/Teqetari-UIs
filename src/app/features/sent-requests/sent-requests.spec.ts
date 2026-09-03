import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentRequests } from './sent-requests';

describe('SentRequests', () => {
  let component: SentRequests;
  let fixture: ComponentFixture<SentRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(SentRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
