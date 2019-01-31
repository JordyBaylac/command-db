
const RecordStatus = Object.freeze({
    UNSET: Symbol("UNSET"),
    SET: Symbol("SET"),
});

class Record {
    constructor(name, value) {
        this.status = RecordStatus.SET;
        this.name = name;
        this.value = value;
    }
}

exports.Record = Record;
exports.RecordStatus = RecordStatus;
