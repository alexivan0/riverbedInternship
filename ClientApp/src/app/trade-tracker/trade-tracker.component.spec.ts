import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeTrackerComponent } from './trade-tracker.component';

describe('TradeTrackerComponent', () => {
  let component: TradeTrackerComponent;
  let fixture: ComponentFixture<TradeTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
