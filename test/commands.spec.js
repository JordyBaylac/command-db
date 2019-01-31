/* test/sum.js */

const { createStorage } = require('../src/storage/db');
const { createCommandHandler } = require('../src/commands/command_handler');

var expect = require('chai').expect;

describe('Part 1', function () {

    let storage;
    let commandHandler;

    beforeEach(() => {
        storage = createStorage();
        commandHandler = createCommandHandler(storage);
    })

    it('GET a non stored variable should return NULL', function () {
        let res = commandHandler.process('GET unknown');
        expect(res).to.equal('NULL')
    })

    it('GET an stored variable should return its value', function () {
        commandHandler.process('SET a 10');
        let res = commandHandler.process('GET a');
        expect(res).to.equal('10')
    })

    it('GET an stored variable that has been UNSET should return NULL', function () {
        commandHandler.process('SET a 10');
        commandHandler.process('UNSET a');
        let res = commandHandler.process('GET a');
        expect(res).to.equal('NULL')
    })

    it('COUNT variables matching a value should return the correct number', function () {
        commandHandler.process('SET a 10');
        commandHandler.process('SET b 10');
        let res = commandHandler.process('COUNT 10');
        expect(res).to.equal(2)
    })

    it('COUNT variables matching a value not stored should return 0', function () {
        let res = commandHandler.process('COUNT 20');
        expect(res).to.equal(0)
    })

    it('COUNT variables matching a value should not count variables that have been UNSET', function () {
        commandHandler.process('SET a 10');
        commandHandler.process('SET b 10');
        commandHandler.process('UNSET a');
        let res = commandHandler.process('COUNT 10');
        expect(res).to.equal(1)
    })

    it('COUNT should not count variables that have been SET with other value', function () {
        commandHandler.process('SET a 10');
        commandHandler.process('SET b 10');
        commandHandler.process('UNSET a');
        commandHandler.process('SET b 30');
        let res = commandHandler.process('COUNT 10');
        expect(res).to.equal(0)
    })

})