import _ from 'lodash';

const Computus = require('./computus.js');

const Quattuor = (year) => {
    let {from, to} = _.cloneDeep(Computus(year));
    const dateRange = _.cloneDeep({from, to});
    dateRange.to.subtract(9, 'days');
    to = _.cloneDeep(dateRange.to);
    dateRange.to.subtract(38, 'days');
    from = _.cloneDeep(dateRange.to);

    return {
        from,
        to
    };
};

module.exports = Quattuor;