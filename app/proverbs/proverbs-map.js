import DateHelper from '../utils/date-helper';
import GenericHelper from '../utils/generic-helper';

function getProverbsByCategory(category) {
    return this.proverbs[category];
}

export default class ProverbsMap {
    constructor(proverbs, seasonConfig) {
        this.proverbs = proverbs;
        this.seasonConfig = seasonConfig;

        this.CATEGORIES = {
            RANDOM: 'random',
            SEASONS: 'seasons',
            FESTIVE_SEASONS: 'festive seasons'
        };

        getProverbsByCategory = getProverbsByCategory.bind(this);
    }

    toPrioritizedList(config, configParams) {
        let proverbArray = [];
        for (let i = 0; i < config.length; i++) {
            proverbArray = Reflect.apply(config[i].fn, this, [configParams[i]]);
            if (!_.isEmpty(proverbArray)) {
                return proverbArray;
            }
        }
        return proverbArray;
    }

    discardProverb(proverb) {
        for (let key in this.proverbs) {
            if (this.proverbs.hasOwnProperty(key)) {
                const proverbIndex = _.findIndex(this.proverbs[key], p => p === proverb);
                if (proverbIndex >= 0) {
                    return _.pullAt(this.proverbs[key], [proverbIndex]);
                }
            }
        }
    }

    getDayProverbs(day) {
        return getProverbsByCategory(day);
    }

    getMonthProverbs(month) {
        return getProverbsByCategory(month);
    }

    getDateEnumProverbs(dateKey) {
        const proverbsKeys = Object.keys(this.proverbs);
        return GenericHelper.flattenArray(proverbsKeys.filter(key =>
            DateHelper.isDateInEnum(dateKey, key))
            .map(key => this.proverbs[key]));
    }

    getDateRangeProverbs(dateKey) {
        const proverbsKeys = Object.keys(this.proverbs);
        return GenericHelper.flattenArray(proverbsKeys.filter(key => DateHelper.isDateInRange(dateKey, key))
            .map(key => this.proverbs[key]));
    }

    getFestiveSeasonProverbs(dateKey) {
        const proverbsKeys = Object.keys(this.proverbs);
        return GenericHelper.flattenArray(proverbsKeys.filter(key =>
            DateHelper.isDateInFestiveSeason(dateKey, key, this.seasonConfig, this.CATEGORIES.FESTIVE_SEASONS))
            .map(key => this.proverbs[key]));
    }

    getSeasonProverbs(dateKey) {
        const proverbsKeys = Object.keys(this.proverbs);
        return GenericHelper.flattenArray(proverbsKeys.filter(key =>
            DateHelper.isDateInSeason(dateKey, key, this.seasonConfig, this.CATEGORIES.SEASONS))
            .map(key => this.proverbs[key]));
    }

    getWeekdayProverbs(dateKey) {
        const proverbsKeys = Object.keys(this.proverbs);
        const momentDate = DateHelper.buildDateFromDateKey(dateKey);
        const weekday = DateHelper.formatWeekday(momentDate);
        return GenericHelper.flattenArray(proverbsKeys.filter(key => DateHelper.isDateInWeekday(weekday, key))
            .map(key => this.proverbs[key]));
    }

    getRandomProverbs() {
        return getProverbsByCategory(this.CATEGORIES.RANDOM);
    }
}