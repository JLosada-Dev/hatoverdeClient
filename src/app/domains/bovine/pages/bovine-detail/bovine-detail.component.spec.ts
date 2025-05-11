import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BovineDetailComponent } from './bovine-detail.component';

describe('BovineDetailComponent', () => {
  let component: BovineDetailComponent;
  let fixture: ComponentFixture<BovineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BovineDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BovineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
