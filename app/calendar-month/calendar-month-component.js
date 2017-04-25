import {Component, EventEmitter, Input, Output} from '@angular/core';
import CalendarService from '../calendar-service';


const moment = require('moment');

@Component({
    selector: 'adg-calendar-month',
    styles: [require('./calendar-month.scss')],
    template: require('./calendar-month.html')
})
export class CalendarMonthComponent {
    @Input('month-vm') monthVM;
    @Output() onMonthChange = new EventEmitter();


    ngOnChanges(changes) {
        if (changes.monthVM) {
            this.month = changes.monthVM.currentValue;
        }
    }

    previous() {
        const previousMonth = moment().month(this.month).subtract(1, 'months').month();
        this.onMonthChange.emit(previousMonth);
    }

    next() {
        const nextMonth = moment().month(this.month).add(1, 'months').month();
        this.onMonthChange.emit(nextMonth);
    }
}