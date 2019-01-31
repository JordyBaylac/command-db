
const { Scope, NullScope } = require('./scope');
const util = require('util')
function printScope(title, scope) {
    console.log(title, util.inspect(scope, false, null, true))
}

class InMemoryDB {

    constructor() {
        this.rootScope = new Scope(new NullScope());
        this.scopes = [this.rootScope];
    }

    beginTransaction() {
        this.scopes.push(new Scope(this._lastScope()));
    }

    rollbackLastTransaction() {
        if (this.scopes.length === 1)
            return false;
        this.scopes.pop();
        return true;
    }

    commitAllTransactions() {
        // printScope('root', this.rootScope)
        for (let i = 1; i < this.scopes.length; i++) {
            const scope = this.scopes[i];
            // printScope(`local ${i}`, scope)
            this.rootScope.mergeFrom(scope);
        }
        this.scopes = [this.rootScope];
    }

    _lastScope() {
        return this.scopes[this.scopes.length - 1];
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
