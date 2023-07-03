/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefinitionComponent } from './user-definition.component';

describe('UserDefinitionComponent', () => {
  let component: UserDefinitionComponent;
  let fixture: ComponentFixture<UserDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDefinitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
