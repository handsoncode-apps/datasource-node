module.exports = class URI {
    constructor(object) {
        this.object = object
    }

    _serialize (object, prefix = undefined) {
        for (property in object) {
            if (object.hasOwnProperty(property)) {
                let key = prefix ? prefix + '[' + property + ']' : property;
                let value = object[property]
                queryString.push((value !== null && typeof value === 'object') ? this._serialize(value, key) : '')
            }
        }

    }

    dbString() {
        if (this.object === undefined) {
            return '';
        }
        return '?' + this._serialize(this.object)
    }

}