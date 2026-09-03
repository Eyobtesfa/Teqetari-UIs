import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedRequests } from './received-requests';

describe('ReceivedRequests', () => {
  let component: ReceivedRequests;
  let fixture: ComponentFixture<ReceivedRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceivedRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
