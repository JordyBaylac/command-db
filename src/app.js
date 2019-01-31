const readlineSync = require('readline-sync');
const chalk = require('chalk');

const { createStorage } = require('./storage/db');
const { createCommandHandler } = require('./commands/command_handler');

const storage = createStorage();
const commandHandler = createCommandHandler(storage);

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

function printResult(text) {
    if (!text && text.length === 0)
        return;
    return console.log(chalk.blue(text));
}

function printError(err) {
    return console.log(chalk.red.bold(err.toString()));
}




// console.log(chalk.blue.bgRed.bold('Hello world!'));
// console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

// // Wait for user's response.
// const userName = readlineSync.question('May I have your name? ');
// console.log(chalk.blue('Hi ' + userName + '!'));