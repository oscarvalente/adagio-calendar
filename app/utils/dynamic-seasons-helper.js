const moment = require('moment');

const DIRECTORIES = {
    SEASONS_STRATEGY: './season-strategies/'
};

const REGEX = {
    SEASON_STRATEGY: /^[a-z]*[A-Za-z]*$/g
};

export default class DynamicSeasonsHelper {
    static calcDateRange(strategyName) {
        const strategyAlg = require(DIRECTORIES.SEASONS_STRATEGY + strategyName + '.js');
        return strategyAlg(moment().year());
    }

    static isValid(strategyName) {
        return strategyName.match(REGEX.SEASON_STRATEGY);
    }
}