
const acceptedCommands = ['SET', 'GET', 'UNSET', 'COUNT', 'END']

const isAcceptedCommand = commandName => acceptedCommands.includes(commandName) != null;

class CommandHandler {

    constructor(storage) {
        this.storage = storage;
    }

    process(commandLine) {
        let command = this.extractCommand(commandLine);
        return this.handle(command);
    }

    extractCommand(commandLine) {
        if (!commandLine)
            throw new Error("command line cannot be empty");
    
        const commandSplit = commandLine.split(' ');
        const commandName = commandSplit[0];
    
        if (!isAcceptedCommand(commandName))
            throw new Error("a command must be one of " + Object.values(acceptedCommands));
    
        return {
            name: commandName,
            arguments: commandSplit.slice(1)
        }
    }

    handle(command) {
        let storage = this.storage;
        let result = "";

        switch (command.name) {
            case 'SET':
                storage.set.apply(storage, command.arguments);
                break;
            case 'GET':
                const value = storage.get.apply(storage, command.arguments);
                result = value || 'NULL';
                break;
            case 'UNSET':
                storage.unset.apply(storage, command.arguments);
                break;
            case 'COUNT':
                const count = storage.count.apply(storage, command.arguments);
                result = count;
                break;
        }

        return result;
    }

}

exports.createCommandHandler = (storage) => new CommandHandler(storage);
