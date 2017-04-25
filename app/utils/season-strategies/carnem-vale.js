import _ from 'lodash';

const Computus = require('./computus.js');

const CarnemVale = (year) => {
    let {from, to} = _.cloneDeep(Computus(year));
    const dateRange = _.cloneDeep({from, to});
    dateRange.to.subtract(48, 'days');
    to = _.cloneDeep(dateRange.to);
    dateRange.to.subtract(1, 'days');
    from = _.cloneDeep(dateRange.to);

    return {
        from,
        to
    };
};

module.exports = CarnemVale;