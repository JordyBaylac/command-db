const argv = require('minimist')(process.argv.slice(2));

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

    if(argv['transactional']) {
        Container.CommandHandler = new TransactionalCommandHandler(storage);
    } else {
        Container.CommandHandler = new BaseCommandHandler(storage);
    }

}

initContainer();
exports.Container = Container;
