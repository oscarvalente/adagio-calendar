import Rx from 'rxjs/Rx';
import Proverbs from './resources/proverbs.json';
import SeasonConfig from './resources/season-config.json';
import _ from 'lodash';

const Moment = require('moment');
const momentRange = require('moment-range');
const moment = momentRange.extendMoment(Moment);

const REGEX = {
    DATE_RANGE: /^([0-9]{1,2}\/{1}[0-9]{1,2}\-?){2}\n?$/gi, // TODO IMPROVE DAY/MONTH VALIDATION
    DATE_ENUM: /^([[0-9]{1,2}\/{1}[0-9]{1,2}\,?)*\n?$/gi,
    WEEKDAY_ENUM: /^((sun|mon|tue|wed|thu|fri|sat)\,?)*\n?$/gi
};
const KEYS = {
    RANDOM: 'random',
    SEASONS: 'seasons',
    FESTIVE_SEASONS: 'festive seasons'
};

const PROVERB_PRIORITY = [
    {
        category: 'DAY',
        fn: getDayProverbs
    },
    {
        category: 'ENUM',
        fn: getDateEnumProverbs
    },
    {
        category: 'RANGE',
        fn: getDateRangeProverbs
    },
    {
        category: 'FESTIVE_SEASON',
        fn: getFestiveSeasonProverbs
    },
    {
        category: 'MONTH',
        fn: getMonthProverbs
    },
    {
        category: 'SEASON',
        fn: getSeasonProverbs
    },
    {
        category: 'WEEKDAY',
        fn: getWeekdayProverbs
    },
    {
        category: 'RANDOM',
        fn: getRandomProverbs
    }
];

function getMomentByDateKey(dateKey) {
    const dateValue = dateKey.split('/');
    const dateMonth = parseInt(dateValue[1]) - 1;
    return moment([moment().year(), dateMonth, dateValue[0]]);
}

function getRandomNumberUpTo(max) {
    return Math.floor((Math.random() * max));
}

function getMonthForDate(date) {
    return moment(date).format('MMM');
}

function formatDateKey(date) {
    return moment(date).format('D/M');
}

function isDateKeyBetweenDates(dateKey, beginDateKey, endDateKey) {
    const beginDateValue = beginDateKey.split('/');
    const endDateValue = endDateKey.split('/');
    const currentYear = moment().year();
    const beginDateMonth = parseInt(beginDateValue[1]) - 1;
    const beginDate = moment([currentYear, beginDateMonth, beginDateValue[0]]);
    const endDateMonth = parseInt(endDateValue[1]) - 1;
    const endDate = moment([currentYear, endDateMonth, endDateValue[0]]);
    const dateKeyValue = dateKey.split('/');
    const dateKeyMonth = parseInt(dateKeyValue[1]) - 1;
    const dateKeyDate = moment([currentYear, dateKeyMonth, dateKeyValue[0]]);

    return moment.range(beginDate, endDate).contains(dateKeyDate);
}

function isDateInRange(dateKey, key) {
    if (key.match(REGEX.DATE_RANGE)) {
        const dates = key.split('-');
        return isDateKeyBetweenDates(dateKey, dates[0], dates[1]);
    }

    return false;
}

function isDateInEnum(dateKey, key) {
    return key.match(REGEX.DATE_ENUM) && key.split(',').indexOf(dateKey) >= 0;
}

function isFestiveSeason(dateKey) {
    return Object.keys(SeasonConfig[KEYS.FESTIVE_SEASONS]).indexOf(dateKey) >= 0;
}

function isSeason(dateKey) {
    return Object.keys(SeasonConfig[KEYS.SEASONS]).indexOf(dateKey) >= 0;
}

function isDateInFestiveSeason(dateKey, key) {
    return isFestiveSeason(key) &&
        isDateInRange(dateKey, SeasonConfig[KEYS.FESTIVE_SEASONS][key]);
}

function isDateInSeason(dateKey, key) {
    return isSeason(key) && isDateInRange(dateKey, SeasonConfig[KEYS.SEASONS][key]);
}

function isDateInWeekday(dateKey, key) {
    return key.match(REGEX.WEEKDAY_ENUM) && key.split(',').indexOf(dateKey) >= 0;
}

function flattenArray(array) {
    return [].concat(...array);
}

function getDayProverbs(day) {
    return Proverbs[day];
}

function getMonthProverbs(monthTLA) {
    return Proverbs[monthTLA.toLowerCase()];
}

function getDateEnumProverbs(dateKey) {
    const proverbsKeys = Object.keys(Proverbs);
    return flattenArray(proverbsKeys.filter(key => isDateInEnum(dateKey, key))
        .map(key => Proverbs[key]));
}

function getDateRangeProverbs(dateKey) {
    const proverbsKeys = Object.keys(Proverbs);
    return flattenArray(proverbsKeys.filter(key => isDateInRange(dateKey, key))
        .map(key => Proverbs[key]));
}

function getFestiveSeasonProverbs(dateKey) {
    const proverbsKeys = Object.keys(Proverbs);
    return flattenArray(proverbsKeys.filter(key => isDateInFestiveSeason(dateKey, key))
        .map(key => Proverbs[key]));
}

function getSeasonProverbs(dateKey) {
    const proverbsKeys = Object.keys(Proverbs);
    return flattenArray(proverbsKeys.filter(key => isDateInSeason(dateKey, key))
        .map(key => Proverbs[key]));
}

function getWeekdayProverbs(dateKey) {
    const proverbsKeys = Object.keys(Proverbs);
    const momentDateKey = getMomentByDateKey(dateKey);
    const weekday = moment(momentDateKey).format('ddd').toLowerCase();
    return flattenArray(proverbsKeys.filter(key => isDateInWeekday(weekday, key))
        .map(key => Proverbs[key]));
}

function getRandomProverbs() {
    return Proverbs[KEYS.RANDOM];
}

function buildProverbsByPriority(priorityConfig, configParams) {
    for (let i = 0; i < priorityConfig.length; i++) {
        const fn = priorityConfig[i].fn;
        const proverbArray = configParams[i] ? fn(configParams[i]) : fn();
        if (!_.isEmpty(proverbArray)) {
            return {
                list: proverbArray,
                category: priorityConfig[i].category
            };
        }
    }
    return [];
}

function discardProverb(proverb) {
    for (let key in Proverbs) {
        if (Proverbs.hasOwnProperty(key)) {
            const proverbIndex = _.findIndex(Proverbs[key], p => p === proverb);
            if (proverbIndex >= 0) {
                return _.pullAt(Proverbs[key], [proverbIndex]);
            }
        }
    }
}

export default class ProverbEngine {
    static getProverbsForMonth(month) {
        const currentYear = moment().year();
        const monthIndex = moment().month(month).month();
        const daysInMonth = moment([currentYear, monthIndex]).daysInMonth();

        return Rx.Observable.create((observer) => {
            let i = 0;
            while (++i <= daysInMonth) {
                const date = moment([currentYear, monthIndex, i]);
                const dateKey = formatDateKey(date);
                const month = getMonthForDate(date);
                const proverbsPriorityParams = [dateKey, dateKey, dateKey, dateKey, month, dateKey, dateKey,];
                const prioritizedProverbs = buildProverbsByPriority(PROVERB_PRIORITY, proverbsPriorityParams);
                const randomIndex = getRandomNumberUpTo(prioritizedProverbs.list.length);
                const suggestedProverb = prioritizedProverbs.list[randomIndex];

                observer.next({
                    proverb: suggestedProverb,
                    dayIndex: i - 1
                });

                discardProverb(suggestedProverb);
            }
            observer.complete();
        });
    }
}
