/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component } from '@angular/core';

import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'marketwatch-confirmation-management',
  templateUrl: './confirmation-management.component.html',
  styleUrls: ['./confirmation-management.component.scss'],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class ConfirmationManagementComponent {
  constructor(public animationService: AnimationService) {}
}
