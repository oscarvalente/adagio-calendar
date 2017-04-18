import {Component, Input} from '@angular/core';

@Component({
    selector: 'adg-calendar-day',
    styles: [require('./calendar-day.scss')],
    template: require('./calendar-day.html')
})
export class CalendarDayComponent {
    @Input('day-vm') dayVM;

    ngOnChanges(changes) {
        if (changes['dayVM']) {
            this.day = changes.dayVM.currentValue;
        }
    }
}