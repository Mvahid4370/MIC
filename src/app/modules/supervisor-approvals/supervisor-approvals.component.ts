import { Component } from '@angular/core';
import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'marketwatch-supervisor-approvals',
  templateUrl: './supervisor-approvals.component.html',
  styles: [``],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class SupervisorApprovalsComponent {
  constructor(public animationService: AnimationService) {}
}
