/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionAssignmentComponent } from './user-permission-assignment.component';

describe('UserPermissionAssignmentComponent', () => {
  let component: UserPermissionAssignmentComponent;
  let fixture: ComponentFixture<UserPermissionAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPermissionAssignmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPermissionAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
