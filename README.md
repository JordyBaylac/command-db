# In-memory transactional database example. 

This expose a key-value storage, implemented in memory. It supports transactional commands. Example:

```bash
> SET a 10
> BEGIN
> COUNT 10
1
> BEGIN
> UNSET a
> COUNT 10
0
> ROLLBACK
> COUNT 10
1
> END
```

## Usage

```bash
npm install
npm test

# start the app with the minimal command set
npm run minimal

# start with transactional support
npm run transactional
```

## Dependencies

* [minimist](https://www.npmjs.com/package/minimist): for reading command line arguments.
* [readlineSync](https://www.npmjs.com/package/readline-sync): for asking questions on the terminal.
* [chalk](https://github.com/chalk/chalk): for printing colorized messages.
* [mocha](https://mochajs.org/): testing framework.
* [chai](https://www.chaijs.com/api/bdd/): assertion library.

## TODO

* add validation for unsupported commands
* include support for a real storage