import {Component} from '@angular/core';
import {CalendarService} from './calendar-service';

@Component({
    selector: 'adg-calendar',
    styles: [require('./calendar.scss')],
    template: require('./calendar.html'),
    providers: [CalendarService]
})
export class CalendarComponent {
    constructor() {
        this.title = 'Adagio Calendar';
        this.days = [];
        CalendarService.buildDaysViewModel().subscribe((x) => {
            this.days.push(x);
        });
    }
}