'use strict';

class ChangeEventData {
    changes: [
        {
            row: number;
            column: number;
            oldValue: any;
            newValue: any;
        }
    ]
    source: String;
}

module.exports = { ChangeEventData }