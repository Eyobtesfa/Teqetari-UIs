import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementContract } from './placement-contract';

describe('PlacementContract', () => {
  let component: PlacementContract;
  let fixture: ComponentFixture<PlacementContract>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementContract],
    }).compileComponents();

    fixture = TestBed.createComponent(PlacementContract);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
