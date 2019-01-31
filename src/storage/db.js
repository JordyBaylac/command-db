
const { Scope, NullScope } = require('./scope');

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
        this._lastScope().setRecord(name, value);
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

exports.createStorage = () => new InMemoryDB();
