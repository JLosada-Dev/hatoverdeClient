import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkMonitorComponent } from './milk-monitor.component';

describe('MilkMonitorComponent', () => {
  let component: MilkMonitorComponent;
  let fixture: ComponentFixture<MilkMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilkMonitorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilkMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
