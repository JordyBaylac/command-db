
const { Record, RecordStatus } = require('./record');

class NullScope {
    setRecord(recname, valueord) { };
    getRecord(name) { return null; };
    unsetRecord(name) { return false; };
    countByValue(value, unsetRecords) { return 0; };
}

class Scope {

    constructor(parentScope) {
        this.records = {};
        this.parentScope = parentScope;
    }

    _hasRecord(name) {
        return this.records.hasOwnProperty(name);
    }

    mergeFrom(otherScope) {
        Object.values(otherScope.records)
            .forEach((r) => this.setRecord(r.name, r.value));
    }

    setRecord(name, value) {
        let newRecord = new Record(name, value);
        this.records[newRecord.name] = newRecord;
    }

    getRecord(name) {
        if (!this._hasRecord(name)) {
            return this.parentScope.getRecord(name);
        }
        let record = this.records[name];
        return record.status === RecordStatus.UNSET ? null : record;
    }

    unsetRecord(name) {
        if (!this._hasRecord(name)) {
            let fromParent = this.parentScope.getRecord(name);
            if (!fromParent || fromParent.status === RecordStatus.UNSET) {
                return false;
            }
            this.setRecord(name, fromParent.value);
        }

        let record = this.getRecord(name);
        record.status = RecordStatus.UNSET;
        return true;
    }

    countByValue(value, unsetRecords) {
        unsetRecords = unsetRecords || []

        const recordsMatchingValue = Object.values(this.records)
            .filter(record => {
                return record.status !== RecordStatus.UNSET
                    && record.value === value
                    && unsetRecords.indexOf(record.name) === -1;
            });

        const currentUnsetRecords = Object.values(this.records)
            .filter(record => record.status === RecordStatus.UNSET)
            .map(record => record.name);

        const predecessorCount = this.parentScope.countByValue(value, [...unsetRecords, ...currentUnsetRecords]);;
        return recordsMatchingValue.length + predecessorCount;
    }

}

exports.NullScope = NullScope;
exports.Scope = Scope;
