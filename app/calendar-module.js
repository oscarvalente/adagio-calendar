import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {CalendarComponent}  from './calendar-component';
import {CalendarMonthComponent}  from './calendar-month-component';
import {CalendarDayComponent}  from './calendar-day-component';

const moment = require('moment');

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        CalendarComponent,
        CalendarMonthComponent,
        CalendarDayComponent
    ],
    bootstrap: [
        CalendarComponent
    ]
})

export class CalendarModule {
    constructor() {
        moment.locale('pt');
    }
}
