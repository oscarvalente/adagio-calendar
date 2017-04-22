import Rx from 'rxjs/Rx';
import Proverbs from '../resources/proverbs.json';
import SeasonConfig from '../resources/season-config.json';
import _ from 'lodash';
import ProverbsMap from './proverbs-map';
import DateHelper from '../utils/date-helper';
import GenericHelper from '../utils/generic-helper';

const Moment = require('moment');
const momentRange = require('moment-range');
const moment = momentRange.extendMoment(Moment);

const proverbsMap = new ProverbsMap(_.cloneDeep(Proverbs), SeasonConfig);
const PROVERBS_PRIORITY = [
    {
        category: 'DAY',
        fn: proverbsMap.getDayProverbs
    },
    {
        category: 'ENUM',
        fn: proverbsMap.getDateEnumProverbs
    },
    {
        category: 'RANGE',
        fn: proverbsMap.getDateRangeProverbs
    },
    {
        category: 'FESTIVE_SEASON',
        fn: proverbsMap.getFestiveSeasonProverbs
    },
    {
        category: 'MONTH',
        fn: proverbsMap.getMonthProverbs
    },
    {
        category: 'SEASON',
        fn: proverbsMap.getSeasonProverbs
    },
    {
        category: 'WEEKDAY',
        fn: proverbsMap.getWeekdayProverbs
    },
    {
        category: 'RANDOM',
        fn: proverbsMap.getRandomProverbs
    }
];

function resetProverbs() {
    proverbsMap.proverbs = _.cloneDeep(Proverbs);
}

function getRandomProverb(fromList) {
    const randomIndex = GenericHelper.getRandomNumberUpTo(fromList.length);
    return randomIndex !== null ? fromList[randomIndex] : '';
}

export default class ProverbEngine {
    static getProverbsForMonth(month) {
        moment.locale('en');

        try {
            const currentYear = moment().year();
            const monthIndex = DateHelper.getMonthIndex(month);
            const daysInMonth = DateHelper.getDaysInMonth(currentYear, monthIndex);

            return Rx.Observable.create((observer) => {
                let i = 0;
                while (++i <= daysInMonth) {
                    const date = moment([currentYear, monthIndex, i]);
                    const dateKey = DateHelper.formatDateKey(date);
                    const formattedMonth = DateHelper.formatMonthForDate(date);

                    const proverbsPriorityParams = [dateKey, dateKey, dateKey, dateKey,
                        formattedMonth, dateKey, dateKey,];
                    let prioritizedProverbsList = proverbsMap.toPrioritizedList(PROVERBS_PRIORITY, proverbsPriorityParams);
                    if (!prioritizedProverbsList.length) {
                        resetProverbs();
                        prioritizedProverbsList = proverbsMap.toPrioritizedList(PROVERBS_PRIORITY,
                            proverbsPriorityParams);
                    }
                    const suggestedProverb = getRandomProverb(prioritizedProverbsList);

                    observer.next({
                        proverb: suggestedProverb,
                        dayIndex: i - 1
                    });

                    proverbsMap.discardProverb(suggestedProverb);
                }
                observer.complete();
            });
        }
        finally {
            moment.locale('pt');
        }
    }
}
