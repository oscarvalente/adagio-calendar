import {Injectable} from '@angular/core';
import Rx from 'rxjs/Rx';

import ProverbEngine from './proverb-engine';

const moment = require('moment');

function isDayToday(day) {
    return moment().date() === day;
}

@Injectable()
export default class CalendarService {
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
            })
            .toArray();
    }

    static updateWithSelection(day, daysVM) {
        return Rx.Observable.from(daysVM)
            .map(dayVM => {
                dayVM.isSelected = dayVM.title === day;
                return dayVM;
            })
            .toArray();
    }

    static getMonthTitle() {
        return moment().format('MMM');
    }

    static getProverbs() {
        return ProverbEngine.getProverbsForMonth(moment().month());
    }
}