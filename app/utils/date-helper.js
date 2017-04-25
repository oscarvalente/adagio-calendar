import DynamicSeasonsHelper from './dynamic-seasons-helper';

const Moment = require('moment');
const momentRange = require('moment-range');
const moment = momentRange.extendMoment(Moment);

const DATE_REGEX = {
    DATE_RANGE: /^([0-9]{1,2}\/{1}[0-9]{1,2}\-?){2}\n?$/gi, // TODO IMPROVE DAY/MONTH VALIDATION
    DATE_ENUM: /^([[0-9]{1,2}\/{1}[0-9]{1,2}\,?)*\n?$/gi,
    WEEKDAY_ENUM: /^((sun|mon|tue|wed|thu|fri|sat)\,?)*\n?$/gi
};

function isSeason(dateKey, seasonConfigObj, seasonsKey) {
    return Object.keys(seasonConfigObj[seasonsKey]).indexOf(dateKey) >= 0;
}

function isDateBetweenDates(date, beginDate, endDate) {
    return moment.range(beginDate, endDate).contains(date);
}

function isDateKeyBetweenDates(dateKey, beginDateKey, endDateKey) {
    const beginDate = DateHelper.buildDateFromDateKey(beginDateKey);
    const endDate = DateHelper.buildDateFromDateKey(endDateKey);
    const dateKeyDate = DateHelper.buildDateFromDateKey(dateKey);

    return isDateBetweenDates(dateKeyDate, beginDate, endDate);
}

function isDateInDynamicRange(dateKey, key, seasonConfigObj, festiveSeasonsKey) {
    const strategyName = seasonConfigObj[festiveSeasonsKey][key];
    if (DynamicSeasonsHelper.isNameValid(strategyName)) {
        const seasonDateRange = DynamicSeasonsHelper.calcDateRange(strategyName);
        const dateFromDateKey = DateHelper.buildDateFromDateKey(dateKey);

        return isDateBetweenDates(dateFromDateKey, seasonDateRange.from, seasonDateRange.to);
    }

    return false;
}

function isFestiveSeason(dateKey, seasonConfigObj, festiveSeasonKey) {
    return Object.keys(seasonConfigObj[festiveSeasonKey]).indexOf(dateKey) >= 0;
}

export default class DateHelper {
    static isDateInWeekday(dateKey, key) {
        return key.match(DATE_REGEX.WEEKDAY_ENUM) && key.split(',').indexOf(dateKey) >= 0;
    }

    static buildDateFromDateKey(dateKey) {
        const dateKeyValue = dateKey.split('/');
        const dateKeyMonth = parseInt(dateKeyValue[1]) - 1;
        return moment([moment().year(), dateKeyMonth, dateKeyValue[0]]);
    }

    static isDateInRange(dateKey, key) {
        if (key.match(DATE_REGEX.DATE_RANGE)) {
            const dates = key.split('-');
            return isDateKeyBetweenDates(dateKey, dates[0], dates[1]);
        }

        return false;
    }

    static isDateInSeason(dateKey, key, seasonConfigObj, seasonsKey) {
        return isSeason(key, seasonConfigObj, seasonsKey) &&
            DateHelper.isDateInRange(dateKey, seasonConfigObj[seasonsKey][key], DATE_REGEX.DATE_RANGE);
    }

    static isDateInEnum(dateKey, key) {
        return key.match(DATE_REGEX.DATE_ENUM) && key.split(',').indexOf(dateKey) >= 0;
    }

    static isDateInFestiveSeason(dateKey, key, seasonConfigObj, festiveSeasonsKey) {
        return isFestiveSeason(key, seasonConfigObj, festiveSeasonsKey) &&
            (DateHelper.isDateInRange(dateKey, seasonConfigObj[festiveSeasonsKey][key], DATE_REGEX.DATE_RANGE) ||
            isDateInDynamicRange(dateKey, key, seasonConfigObj, festiveSeasonsKey));
    }

    static isDayInMonth(day, month) {
        return day >= 1 && day <= moment().month(month).daysInMonth();
    }

    static formatMonthForDate(date) {
        return moment(date).format('MMM');
    }

    static formatDateKey(date) {
        return moment(date).format('D/M');
    }

    static formatWeekday(date) {
        return moment(date).format('ddd').toLowerCase();
    }

    static getMonthIndex(month) {
        return moment().month(month).month();
    }

    static getDaysInMonth(year, monthIndex) {
        return moment([year, monthIndex]).daysInMonth();
    }

    static isDayToday(date) {
        return moment().format('Y-M-D') === date.format('Y-M-D');
    }

    static isSameMonthYear(date) {
        return moment().format('Y-M') === date.format('Y-M');
    }
}