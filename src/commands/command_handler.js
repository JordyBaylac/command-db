
const acceptedCommands = ['SET', 'GET', 'UNSET', 'COUNT', 'END']

const isAcceptedCommand = commandName => acceptedCommands.includes(commandName) != null;

const extractCommand = (commandLine) => {
    if (!commandLine)
        throw new Error("command line cannot be empty");

    const commandSplit = commandLine.split(' ');
    const commandName = commandSplit[0];
    
    if (!isAcceptedCommand(commandName))
        throw new Error("a command must be one of " + Object.values(acceptedCommands));

    return {
        name: commandName,
        arguments: commandSplit.slice(0)
    }
}

exports.extractCommand = extractCommand;
