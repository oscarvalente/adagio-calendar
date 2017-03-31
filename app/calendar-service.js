import {Injectable} from '@angular/core';
import Rx from 'rxjs/Rx';

const moment = require('moment');

function isDayToday(day) {
    return moment().date() === day;
}

@Injectable()
export class CalendarService {
    static buildDaysViewModel(day) {
        const daysInMonth = moment().daysInMonth();

        const vmSource = Rx.Observable.range(1, daysInMonth)
            .map(i => {
                let isToday = isDayToday(i);
                let isSelected = day ? day === i : isToday;
                return {
                    title: i,
                    isToday,
                    isSelected
                };
            });

        if (day) {
            return vmSource.toArray();
        }

        return vmSource;
    }

    static getMonthTitle() {
        return moment().format('MMM');
    }
}