
const { InMemoryDB } = require('../storage/inmemory_db');
const { BaseCommandHandler } = require('../commands/base_command_handler');
const { TransactionalCommandHandler } = require('../commands/transactional_command_handler');


const Container = {
    CommandHandler: null,
    Storage: null
};

function initContainer() {

    const storage = new InMemoryDB();
    Container.Storage = storage;

    if(1 == 1) {
        Container.CommandHandler = new BaseCommandHandler(storage);
    } else {
        Container.CommandHandler = new TransactionalCommandHandler(storage);
    }

}

initContainer();

exports.Container = Container;