/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDefinitionComponent } from './confirmation-definition.component';

describe('ConfirmationDefinitionComponent', () => {
  let component: ConfirmationDefinitionComponent;
  let fixture: ComponentFixture<ConfirmationDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationDefinitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
