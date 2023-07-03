import { Component } from '@angular/core';

import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'marketwatch-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class ReportsComponent {
  constructor(public animationService: AnimationService) {}
}
