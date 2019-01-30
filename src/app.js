const readlineSync = require('readline-sync');
const chalk = require('chalk');

// console.log(chalk.blue.bgRed.bold('Hello world!'));
// console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

// // Wait for user's response.
// const userName = readlineSync.question('May I have your name? ');
// console.log(chalk.blue('Hi ' + userName + '!'));

const InMemoryDB = require('./db').InMemoryDB;
const extractCommand = require('./commands/command_handler').extractCommand;

const db = new InMemoryDB();

readlineSync.promptLoop(function (input) {
    console.log('-- You said "' + input + '"');   

    try {
        const command = extractCommand(input);
        handleCommand(command);
        return command.action === 'END';
    } catch(err) {
        console.log(chalk.red.bgWhite.bold(err.toString()));
    }

    return false;
    
}, {
        prompt: chalk.red.bold("enter command: ")
});

function handleCommand(command) {
    switch (command.name) {
        case 'SET':
            db.set.apply(db, command.arguments);
            break;
        case 'GET':
            const value = db.get.apply(db, command.arguments);
            print(value);
            break;
        case 'UNSET':
            db.unset.apply(db, command.arguments);
            break;
        case 'COUNT':
            const count = db.count.apply(db, command.arguments);
            print(count);
            break;
    }
}


function print(text) {
    console.log(chalk.blue(text.toString()));
}