import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {CalendarComponent}  from './calendar-component';

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        CalendarComponent
    ],
    bootstrap: [
        CalendarComponent
    ]
})

export class CalendarModule {
}