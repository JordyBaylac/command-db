
class InMemoryDB {

    constructor() {
        this.scope = new GlobalScope();
        this.transactions = [];
    }

    beginTransaction() {
        let transactionScope = new TransactionScope(this.scope);
        this.transactions.push(transactionScope);
    }

}

class GlobalScope {

    constructor() {
        this.data = {};
    }

}

class TransactionScope {

    constructor(parentScope) {
        this.data = {};
        this.parentScope = parentScope;
    }

}