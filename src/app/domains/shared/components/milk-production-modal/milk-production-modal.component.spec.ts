import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkProductionModalComponent } from './milk-production-modal.component';

describe('MilkProductionModalComponent', () => {
  let component: MilkProductionModalComponent;
  let fixture: ComponentFixture<MilkProductionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilkProductionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilkProductionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
