import {Component} from '@angular/core';
import CalendarService from './calendar-service';

function setProverb(proverb, day) {
    day.proverb = proverb;
}

@Component({
    selector: 'adg-calendar',
    styles: [require('./calendar.scss')],
    template: require('./calendar.html'),
    providers: [CalendarService]
})
export class CalendarComponent {
    ngOnInit() {
        this.month = CalendarService.getMonthTitle();

        this.daysSubscription = CalendarService.buildDaysViewModel()
            .subscribe((days) => {
                this.days = days;
                this.ready = true;
            });

        this.proverbsSubscription = CalendarService.getProverbs()
            .subscribe(({proverb, dayIndex}) =>
                setProverb(proverb, this.days[dayIndex])
            );
    }

    ngOnDestroy() {
        this.daysSubscription.unsubscribe();
        this.proverbsSubscription.unsubcribe();
    }

    selectDay(day) {
        CalendarService.updateWithSelection(day, this.days)
            .subscribe((days) =>
                this.days = days
            );
    }

    onMonthChange(newMonth) {
        this.days = [];
        CalendarService.buildDaysViewModelWithProverbs(newMonth)
            .subscribe((day) => {
                this.days.push(day);
            });
    }

}