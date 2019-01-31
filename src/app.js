const readlineSync = require('readline-sync');
const chalk = require('chalk');

const { Container } = require('./config/dependecy_management')

const commandHandler = Container.CommandHandler;
printAvailableCommands(commandHandler);

readlineSync.promptLoop(function (input) {

    try {
        let command = commandHandler.extractCommand(input);
        let res = commandHandler.handle(command);
        printResult(res);
        return command.name === 'END';
    } catch (err) {
        printError(err);
    }

    return false;

}, {
        prompt: chalk.green.bold("> "),
    }
);

function printAvailableCommands(commandHandler) {
    const acceptedCommands = commandHandler.getAcceptedCommands().toString();
    console.log(chalk.yellow.bold('* Available commands: ' + acceptedCommands));
}

function printResult(text) {
    if (!text && text.length === 0)
        return;
    return console.log(chalk.blue(text));
}

function printError(err) {
    return console.log(chalk.red.bold(err.toString()));
}
