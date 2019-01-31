
class BaseCommandHandler {

    constructor(storage) {
        this.storage = storage;
        this.acceptedCommands = ['SET', 'GET', 'UNSET', 'COUNT', 'END'];
    }

    getAcceptedCommands() {
        return this.acceptedCommands;
    }

    setAcceptedCommands(acceptedCommands) {
        this.acceptedCommands = acceptedCommands;
    }

    isAcceptedCommand(commandName) {
        return this.acceptedCommands.includes(commandName) != null;
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

        if (!this.isAcceptedCommand(commandName))
            throw new Error("a command must be one of " + Object.values(this.acceptedCommands));

        return {
            name: commandName,
            arguments: commandSplit.slice(1)
        }
    }

    handle(command) {
        let storage = this.storage;
        let result = '';

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

exports.BaseCommandHandler = BaseCommandHandler;
