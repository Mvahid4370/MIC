/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationManagementComponent } from './confirmation-management.component';

describe('ConfirmationManagementComponent', () => {
  let component: ConfirmationManagementComponent;
  let fixture: ComponentFixture<ConfirmationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
