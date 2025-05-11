import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBovineComponent } from './list-bovine.component';

describe('ListBovineComponent', () => {
  let component: ListBovineComponent;
  let fixture: ComponentFixture<ListBovineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBovineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListBovineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
