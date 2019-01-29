const readlineSync = require('readline-sync');
const chalk = require('chalk');
 
console.log(chalk.blue.bgRed.bold('Hello world!'));
console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

// Wait for user's response.
const userName = readlineSync.question('May I have your name? ');
console.log(chalk.blue('Hi ' + userName + '!'));