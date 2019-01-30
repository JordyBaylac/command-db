
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

    getKey() {
        return this.name.toString();
    }
}

class InMemoryDB {

    constructor() {
        this.rootScope = new Scope(new NullScope());
        this.scopes = [this.rootScope];
    }

    beginTransaction() {
        this.scopes.push(new Scope(this._lastScope()));
    }

    rollbackTransaction() {
        this.scopes.pop();
    }

    commitTransacton() {
        for (let i = 1; i < this.scopes.length; i++) {
            const scope = this.scopes[i];
            this.rootScope.mergeFrom(scope);
        }
        this.scopes = [];
    }

    _lastScope() {
        return this.scopes.length > 0 
            ? this.scopes[this.scopes.length - 1] 
            : this.rootScope;
    }

    set(name, value) {
        let newRecord = new Record(name, value);
        this._lastScope().setRecord(newRecord);
    }

    get(name) {
        let record = this._lastScope().getRecord(name);
        return record ? record.value : null;
    }

    unset(name) {
        return this._lastScope().unsetRecord(name);
    }

    count(value) {
        return this._lastScope().countByValue(value);
    }

}

class NullScope {
    constructor() {}
    setRecord(record){ };
    getRecord(name) { return null;};
    unsetRecord(name) { return false;};
    countByValue(value) { return 0;};
}

class Scope {

    constructor(parentScope) {
        this.records = {};
        this.parentScope = parentScope;
    }

    _hasRecord(key) {
        return this.records.hasOwnProperty(key);
    }

    mergeFrom(otherScope) {
        otherScope.records.forEach(this.setRecord);
    }

    setRecord(record) {
        this.records[record.key()] = record;
    }

    getRecord(name) {
        const key = name.toString();
        if (!this._hasRecord(key)) {
            console.log('dbg:', `TransactionScope::getRecord, record with name ${name} not found`)
            return this.parentScope.getRecord(name);
        }
        let record = this.records[key];
        return record.status === RecordStatus.UNSET ? null : record;
    }

    unsetRecord(name) {
        const key = name.toString();
        if (!this._hasRecord(key)) {
            console.log('dbg:', `TransactionScope::unsetRecord, record with name ${name} not found`)
            let fromParent = this.parentScope.getRecord(name);
            if (!fromParent || fromParent.status === RecordStatus.UNSET) {
                return false;
            }
            this.setRecord(new Record(name, fromParent.value));
        }

        let record = this.getRecord(name);
        record.status = RecordStatus.UNSET;
        return true;
    }

    countByValue(value) {
        const recordsMatchingValue = Object.values(this.records)
            .filter(record => record.status !== RecordStatus.UNSET && record.value === value);
        return recordsMatchingValue.length;
    }

}

exports.InMemoryDB = InMemoryDB;
