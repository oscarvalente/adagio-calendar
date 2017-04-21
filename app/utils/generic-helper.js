export default class GenericHelper {
    static getRandomNumberUpTo(max) {
        return Math.floor((Math.random() * max));
    }

    static flattenArray(array) {
        return [].concat(...array);
    }
}
