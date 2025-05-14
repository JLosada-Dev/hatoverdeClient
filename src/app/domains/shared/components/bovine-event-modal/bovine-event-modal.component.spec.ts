import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BovineEventModalComponent } from './bovine-event-modal.component';

describe('BovineEventModalComponent', () => {
  let component: BovineEventModalComponent;
  let fixture: ComponentFixture<BovineEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BovineEventModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BovineEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
