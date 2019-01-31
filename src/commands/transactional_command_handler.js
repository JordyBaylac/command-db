
const { BaseCommandHandler } = require('./base_command_handler')

class TransactionalCommandHandler extends BaseCommandHandler {

    constructor(storage) {
        super(storage);
        
        const baseAcceptedCommands = super.getAcceptedCommands();
        super.setAcceptedCommands([
            ...baseAcceptedCommands,
            'BEGIN', 'ROLLBACK', 'COMMIT'
        ])
    }

    handle(command) {
        let storage = this.storage;
        let result = '';

        switch (command.name) {
            case 'BEGIN':
                storage.beginTransaction.apply(storage);
                break;
            case 'ROLLBACK':
                const isOk = storage.rollbackLastTransaction.apply(storage);
                result = !isOk ? 'INVALID ROLLBACK' : '';
                break;
            case 'COMMIT':
                storage.commitAllTransactions.apply(storage);
                break;
            default:
                return super.handle(command);
        }

        return result;
    }

}

exports.TransactionalCommandHandler = TransactionalCommandHandler;
