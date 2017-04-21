import Rx from 'rxjs/Rx';
import Proverbs from '../resources/proverbs.json';
import SeasonConfig from '../resources/season-config.json';
import _ from 'lodash';
import LLL from './proverbs-map.js';

let ProverbsList = _.cloneDeep(Proverbs);
const Moment = require('moment');
const momentRange = require('moment-range');
const moment = momentRange.extendMoment(Moment);

const SEASONS_STRATEGY_DIR = './seasons-strategies/';

const REGEX = {
    DATE_RANGE: /^([0-9]{1,2}\/{1}[0-9]{1,2}\-?){2}\n?$/gi, // TODO IMPROVE DAY/MONTH VALIDATION
    DATE_ENUM: /^([[0-9]{1,2}\/{1}[0-9]{1,2}\,?)*\n?$/gi,
    WEEKDAY_ENUM: /^((sun|mon|tue|wed|thu|fri|sat)\,?)*\n?$/gi,
    SEASON_STRATEGY: /^[a-z]*[A-Za-z]*$/g
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

function getRandomNumberUpTo(max) {
    return Math.floor((Math.random() * max));
}

function formatMonthForDate(date) {
    return moment(date).format('MMM').toLowerCase();
}

function formatDateKey(date) {
    return moment(date).format('D/M');
}

function buildDateFromDateKey(dateKey) {
    const dateKeyValue = dateKey.split('/');
    const dateKeyMonth = parseInt(dateKeyValue[1]) - 1;
    return moment([moment().year(), dateKeyMonth, dateKeyValue[0]]);
}

function isDateKeyBetweenDates(dateKey, beginDateKey, endDateKey) {
    const beginDate = buildDateFromDateKey(beginDateKey);
    const endDate = buildDateFromDateKey(endDateKey);
    const dateKeyDate = buildDateFromDateKey(dateKey);

    return isDateBetweenDates(dateKeyDate, beginDate, endDate);
}


function isDateBetweenDates(date, beginDate, endDate) {
    return moment.range(beginDate, endDate).contains(date);
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

function isDateInDynamicRange(dateKey, key) {
    const strategyAlgName = SeasonConfig[KEYS.FESTIVE_SEASONS][key];
    if (strategyAlgName.match(REGEX.SEASON_STRATEGY)) {
        const strategyAlg = require(SEASONS_STRATEGY_DIR + strategyAlgName + '.js');
        const seasonDateRange = strategyAlg(moment().year());
        const dateFromDateKey = buildDateFromDateKey(dateKey);

        return isDateBetweenDates(dateFromDateKey, seasonDateRange.from, seasonDateRange.to);
    }

    return false;
}

function isDateInFestiveSeason(dateKey, key) {
    return isFestiveSeason(key) &&
        (isDateInRange(dateKey, SeasonConfig[KEYS.FESTIVE_SEASONS][key]) ||
        isDateInDynamicRange(dateKey, key));
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

function getDayProverbs(proverbs, day) {
    return proverbs[day];
}

function getMonthProverbs(proverbs, month) {
    return proverbs[month];
}

function getDateEnumProverbs(proverbs, dateKey) {
    const proverbsKeys = Object.keys(proverbs);
    return flattenArray(proverbsKeys.filter(key => isDateInEnum(dateKey, key))
        .map(key => proverbs[key]));
}

function getDateRangeProverbs(proverbs, dateKey) {
    const proverbsKeys = Object.keys(proverbs);
    return flattenArray(proverbsKeys.filter(key => isDateInRange(dateKey, key))
        .map(key => proverbs[key]));
}

function getFestiveSeasonProverbs(proverbs, dateKey) {
    const proverbsKeys = Object.keys(proverbs);
    return flattenArray(proverbsKeys.filter(key => isDateInFestiveSeason(dateKey, key))
        .map(key => proverbs[key]));
}

function getSeasonProverbs(proverbs, dateKey) {
    const proverbsKeys = Object.keys(proverbs);
    return flattenArray(proverbsKeys.filter(key => isDateInSeason(dateKey, key))
        .map(key => proverbs[key]));
}

function getWeekdayProverbs(proverbs, dateKey) {
    const proverbsKeys = Object.keys(proverbs);
    const momentDateKey = buildDateFromDateKey(dateKey);
    const weekday = moment(momentDateKey).format('ddd').toLowerCase();
    return flattenArray(proverbsKeys.filter(key => isDateInWeekday(weekday, key))
        .map(key => proverbs[key]));
}

function getRandomProverbs(proverbs) {
    return proverbs[KEYS.RANDOM];
}

function buildProverbsByPriority(priorityConfig, configParams, proverbsObj) {
    for (let i = 0; i < priorityConfig.length; i++) {
        const fn = priorityConfig[i].fn.bind(null, proverbsObj);
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
    for (let key in ProverbsList) {
        if (ProverbsList.hasOwnProperty(key)) {
            const proverbIndex = _.findIndex(ProverbsList[key], p => p === proverb);
            if (proverbIndex >= 0) {
                return _.pullAt(ProverbsList[key], [proverbIndex]);
            }
        }
    }
}

export default class ProverbEngine {
    static getProverbsForMonth(month) {
        moment.locale('en');

        let l = new LLL([]);

        try {
            const currentYear = moment().year();
            const monthIndex = moment().month(month).month();
            const daysInMonth = moment([currentYear, monthIndex]).daysInMonth();

            return Rx.Observable.create((observer) => {
                let i = 0;
                while (++i <= daysInMonth) {
                    const date = moment([currentYear, monthIndex, i]);
                    const dateKey = formatDateKey(date);
                    const month = formatMonthForDate(date);


                    const proverbsPriorityParams = [dateKey, dateKey, dateKey, dateKey, month, dateKey, dateKey,];
                    let prioritizedProverbs = buildProverbsByPriority(PROVERB_PRIORITY, proverbsPriorityParams,
                        ProverbsList);
                    let proverbsListLength = prioritizedProverbs.list && prioritizedProverbs.list.length;
                    if (!proverbsListLength) {
                        ProverbsList = _.cloneDeep(Proverbs);
                        prioritizedProverbs = buildProverbsByPriority(PROVERB_PRIORITY, proverbsPriorityParams,
                            ProverbsList);
                        proverbsListLength = prioritizedProverbs.list.length;
                    }
                    const randomIndex = getRandomNumberUpTo(proverbsListLength);
                    const suggestedProverb = randomIndex !== null ? prioritizedProverbs.list[randomIndex] : '';

                    observer.next({
                        proverb: suggestedProverb,
                        dayIndex: i - 1
                    });

                    discardProverb(suggestedProverb);
                }
                observer.complete();
            });
        }
        finally {
            moment.locale('pt');
        }
    }
}
