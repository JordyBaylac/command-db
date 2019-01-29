
const acceptedCommands = {
    SET: {
        identifier: 'SET',
        handler: setHandler
    },
    GET: {
        identifier: 'GET',
        handler: setHandler
    },
    UNSET: {
        identifier: 'UNSET',
        handler: setHandler
    },
    COUNT: {
        identifier: 'COUNT',
        handler: setHandler
    },
    END: {
        identifier: 'END',
        handler: setHandler
    }
}

const isAcceptedCommand = action => acceptedCommands[action] != null;

const extractFromLine = (commandLine) => {
    if (!commandLine)
        throw new Error("command line cannot be empty");

    const actionSplit = commandLine.split(' ');
    const command = actionSplit[0];
    if (!isAcceptedCommand(command))
        throw new Error("a command must be one of", Object.values(acceptedCommands));

    const handler = acceptedCommands[command].handler;
    handler(actionSplit.slice(0));
}

var arrMatches = strText.match(rePattern);