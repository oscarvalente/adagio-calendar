import {Component} from '@angular/core';
import CalendarService from '../calendar-service';

function setProverb(proverb, day) {
    day.proverb = proverb;
}

function setMonthCalendarData(monthKey, days) {
    calendarData[monthKey].days = days;
}

let calendarData;

@Component({
    selector: 'adg-calendar',
    styles: [require('./calendar.scss')],
    template: require('./calendar.html'),
    providers: [CalendarService]
})
export class CalendarComponent {
    ngOnInit() {
        calendarData = {};
        this.month = CalendarService.getMonthTitle();

        this.daysSubscription = CalendarService.buildDaysViewModel()
            .subscribe((days) => {
                this.days = days;
                this.ready = true;
                calendarData[this.month] = {
                    days
                };
            });

        this.proverbsSubscription = CalendarService.getProverbs()
            .subscribe(({proverb, dayIndex}) => {
                setProverb(proverb, this.days[dayIndex]);
                setProverb(proverb, calendarData[this.month].days[dayIndex]);
            });
    }

    ngOnDestroy() {
        this.daysSubscription.unsubscribe();
        this.proverbsSubscription.unsubcribe();
        this.days = null;
        calendarData = null;
    }

    selectDay(day) {
        CalendarService.updateWithSelection(day, this.days)
            .subscribe((days) => {
                this.days = days;
                calendarData[this.month].days = this.days;
                setMonthCalendarData(this.month, this.days);
            });
    }

    onMonthChange(newMonth) {
        this.days = [];
        this.month = CalendarService.getMonthTitle(newMonth);
        if (calendarData[this.month] && !!calendarData[this.month].days) {
            this.days = calendarData[this.month].days;
        } else {
            calendarData[this.month] = {
                days: []
            };
            CalendarService.buildDaysViewModelWithProverbs(newMonth)
                .subscribe((day) => {
                    this.days.push(day);
                    calendarData[this.month].days.push(day);
                });
        }
    }

}