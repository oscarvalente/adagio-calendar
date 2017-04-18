const CATEGORIES = {
    RANDOM: 'random',
    SEASONS: 'seasons',
    FESTIVE_SEASONS: 'festive seasons'
};

function getProverbsByCategory(category) {
    return this.proverbs[category];
}

export default class ProverbsMap {
    constructor(proverbs) {
        this.proverbs = proverbs;
        getProverbsByCategory = getProverbsByCategory.bind(this);
    }

    toPrioritizedList(config, configParams) {
        let proverbArray = [];
        for (let i = 0; i < config.length; i++) {
            const fn = config[i].fn.bind(null, this.proverbs);
            proverbArray = configParams[i] ? fn(configParams[i]) : fn();
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

    getRandomProverbs() {
        return getProverbsByCategory(CATEGORIES.RANDOM);
    }
}