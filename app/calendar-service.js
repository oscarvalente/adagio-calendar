import {Injectable} from '@angular/core';
import Rx from 'rxjs/Rx';
import clone from 'lodash/clone';

import DateHelper from './utils/date-helper';
import ProverbEngine from './proverbs/proverb-engine';

const moment = require('moment');

@Injectable()
export default class CalendarService {
    static buildDaysViewModel(month = moment().month()) {
        const daysInMonth = moment().month(month).daysInMonth();

        const monthYearDate = moment([moment().year(), DateHelper.getMonthIndex(month), 1]);
        let isSameMonthYear = DateHelper.isSameMonthYear(monthYearDate);

        return Rx.Observable.range(1, daysInMonth)
            .map(i => {
                const dayDate = moment([moment().year(), DateHelper.getMonthIndex(month), i]);
                let isToday = false;
                let isSelected = false;
                if (isSameMonthYear) {
                    isToday = DateHelper.isDayToday(dayDate);
                    isSelected = isToday;
                } else if (i === 1) {
                    isSelected = true;
                }
                return {
                    title: i,
                    isToday,
                    isSelected
                };
            })
            .toArray();
    }

    static updateWithSelection(day, daysVM) {
        return Rx.Observable.from(daysVM)
            .map(dayVM => {
                const dayClone = clone(dayVM);
                dayClone.isSelected = dayClone.title === day;
                return dayClone;
            });
    }

    static buildDaysViewModelWithProverbs(month = moment().month()) {
        const proverbsSource = ProverbEngine.getProverbsForMonth(month);
        const daysVMSource = CalendarService.buildDaysViewModel(month);
        return daysVMSource.mergeMap((days) => {
            return proverbsSource.map(({dayIndex, proverb}) => {
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