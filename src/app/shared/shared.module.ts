/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* components */
import { CalendarComponent } from './components/calendar/calendar.component';

/* pipes */
import { IRCurrencyPipe } from './pipes/ircurrency.pipe';
import { FaNumPipe } from './pipes/fa-num.pipe';
import { EnNumPipe } from './pipes/en-num.pipe';
import { JDatePipe } from './pipes/jdate.pipe';
import { JyearPipe } from './pipes/jyear.pipe';
import { JdayPipe } from './pipes/jday.pipe';

/* PrimeNG */
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { HasPermissionsDirective } from './directives/has-permissions.directive';

@NgModule({
  declarations: [
    IRCurrencyPipe,
    FaNumPipe,
    EnNumPipe,
    JDatePipe,
    CalendarComponent,
    JyearPipe,
    JdayPipe,
    HasPermissionsDirective,
  ],
  imports: [CommonModule, ButtonModule, RippleModule],
  exports: [
    IRCurrencyPipe,
    FaNumPipe,
    EnNumPipe,
    JDatePipe,
    CalendarComponent,
    JyearPipe,
    JdayPipe,
    HasPermissionsDirective,
  ],
})
export class SharedModule {}
