import {Injectable} from '@angular/core';
import Rx from 'rxjs/Rx';

const moment = require('moment');

function isDayToday(day) {
    return moment().date() === day;
}

@Injectable()
export class CalendarService {
    static buildDaysViewModel() {
        const daysInMonth = moment().daysInMonth();

        return Rx.Observable.range(1, daysInMonth)
            .map(i => {
                let isToday = isDayToday(i);
                return {
                    title: i,
                    isToday,
                    isSelected: isToday
                };
            });
    }
}