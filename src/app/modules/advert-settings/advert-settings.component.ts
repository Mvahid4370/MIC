import { Component } from '@angular/core';
import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'marketwatch-advert-settings',
  templateUrl: './advert-settings.component.html',
  styles: [``],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class AdvertSettingsComponent {
  constructor(public animationService: AnimationService) {}
}
