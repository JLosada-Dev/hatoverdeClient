import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BovineEditModalComponent } from './bovine-edit-modal.component';

describe('BovineEditModalComponent', () => {
  let component: BovineEditModalComponent;
  let fixture: ComponentFixture<BovineEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BovineEditModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BovineEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
