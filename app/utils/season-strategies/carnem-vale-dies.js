import _ from 'lodash';

const Computus = require('./computus.js');

const CarnemValeDay = (year) => {
    let {from, to} = _.cloneDeep(Computus(year));
    const dateRange = _.cloneDeep({from, to});
    dateRange.to.subtract(48, 'days');
    to = _.cloneDeep(dateRange.to);
    from = _.cloneDeep(dateRange.to);

    return {
        from,
        to
    };
};

module.exports = CarnemValeDay;