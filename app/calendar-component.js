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
        this.month = CalendarService.getMonthTitle();
        this.days = [];
        CalendarService.buildDaysViewModel().subscribe((day) => {
            this.days.push(day);
        });
    }

    selectDay(day) {
        CalendarService.buildDaysViewModel(day).subscribe((days) => {
            this.days = days;
        });
    }


}