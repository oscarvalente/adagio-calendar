import _ from 'lodash';
import DateHelper from '../date-helper';

const moment = require('moment');

function getDayForApril(d, e, M) {
    if (d === 29 && e === 6) {
        return 19;
    } else if (d === 28 && e === 6 && (11 * M + 11) % 30 < 19) {
        return 18;
    } else {
        return d + e - 9;
    }
}

/**
 * @see https://en.wikipedia.org/wiki/Computus#Gauss_algorithm
 */
const Computus = (year) => {
    let toDate;
    const a = year % 19;
    const b = year % 4;
    const c = year % 7;
    const k = Math.floor(year / 100);
    const p = Math.floor((13 + 8 * k) / 25);
    const q = Math.floor(k / 4);
    const M = (15 - p + k - q) % 30;
    const N = (4 + k - q) % 7;
    const d = (19 * a + M) % 30;
    const e = (2 * b + 4 * c + 6 * d + N) % 7;
    const dayForMarch = 22 + d + e;

    if (DateHelper.isDayInMonth(dayForMarch, 'mar')) {
        // dayForMarch + 1 toDate reach monday after
        toDate = moment([year, 2, dayForMarch + 1]);
    } else {
        const dayForApril = getDayForApril(d, e, M);
        toDate = moment([year, 3, dayForApril + 1]);
    }
    const to = _.cloneDeep(toDate);
    const from = toDate.subtract(8, 'days');

    return {
        from,
        to
    };
};

module.exports = Computus;