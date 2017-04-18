import {Injectable} from '@angular/core';
import Rx from 'rxjs/Rx';

import ProverbEngine from './proverb-engine';

const moment = require('moment');

function isDayToday(day) {
    return moment().date() === day;
}

@Injectable()
export default class CalendarService {
    static buildDaysViewModel(month = moment().month()) {
        const daysInMonth = moment().month(month).daysInMonth();

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

    static updateWithSelection(day, daysVM = []) {
        return Rx.Observable.from(daysVM)
            .map(dayVM => {
                dayVM.isSelected = dayVM.title === day;
                return dayVM;
            })
            .toArray();
    }

    static buildDaysViewModelWithProverbs(month = moment().month()) {
        const proverbsSource = ProverbEngine.getProverbsForMonth(month);
        const daysVMSource = CalendarService.buildDaysViewModel(month);
        return daysVMSource.mergeMap((days) => {
            return proverbsSource.map(({dayIndex, proverb}, index) => {
                days[dayIndex].proverb = proverb;
                return days[dayIndex];
            });
        });

        /*dayProverb.proverb = dayProverb.proverb;
         return dayProverb;*/
    }

    static getMonthTitle(month = moment().month()) {
        return moment().month(month).format('MMMM');
    }

    static getProverbs(month = moment().month()) {
        return ProverbEngine.getProverbsForMonth(month);
    }
}