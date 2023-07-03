import { Component } from '@angular/core';

import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'marketwatch-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [``],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class UserProfileComponent {
  constructor(public animationService: AnimationService) {}
}
