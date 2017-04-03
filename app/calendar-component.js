import {Component} from '@angular/core';
import CalendarService from './calendar-service';

@Component({
    selector: 'adg-calendar',
    styles: [require('./calendar.scss')],
    template: require('./calendar.html'),
    providers: [CalendarService]
})
export class CalendarComponent {
    constructor() {
        this.month = CalendarService.getMonthTitle();
        this.days = [];

        CalendarService.buildDaysViewModel().subscribe((days) => {
            this.setDays(days);
        });

        CalendarService.getProverbs().subscribe(({proverb, dayIndex}) => {
            this.days[dayIndex].proverb = proverb;
        });
    }

    selectDay(day) {
        CalendarService.updateWithSelection(day, this.days).subscribe((days) => {
            this.setDays(days);
        });
    }

    setDays(days) {
        this.days = days;
    }
}