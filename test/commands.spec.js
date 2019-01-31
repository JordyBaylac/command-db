
const { InMemoryDB } = require('../src/storage/inmemory_db')
const { TransactionalCommandHandler } = require('../src/commands/transactional_command_handler')

var expect = require('chai').expect

describe('#Commands verification', function () {
    
    let commandHandler = null;

    beforeEach(() => {
        const storage = new InMemoryDB()
        commandHandler = new TransactionalCommandHandler(storage)
    })

    context('Part 1', () => {

        it('GET a non stored variable should return "NULL"', function () {
            let res = commandHandler.process('GET unknown')
            expect(res).to.equal('NULL')
        })

        it('GET an stored variable should return its value', function () {
            commandHandler.process('SET a 10')
            let res = commandHandler.process('GET a')
            expect(res).to.equal('10')
        })

        it('GET an stored variable that has been UNSET should return "NULL"', function () {
            commandHandler.process('SET a 10')
            commandHandler.process('UNSET a')
            let res = commandHandler.process('GET a')
            expect(res).to.equal('NULL')
        })

        it('COUNT variables matching a value should return the correct number', function () {
            commandHandler.process('SET a 10')
            commandHandler.process('SET b 10')
            let res = commandHandler.process('COUNT 10')
            expect(res).to.equal(2)
        })

        it('COUNT variables matching a value not stored should return 0', function () {
            let res = commandHandler.process('COUNT 20')
            expect(res).to.equal(0)
        })

        it('COUNT variables matching a value should not count variables that have been UNSET', function () {
            commandHandler.process('SET a 10')
            commandHandler.process('SET b 10')
            commandHandler.process('UNSET a')
            let res = commandHandler.process('COUNT 10')
            expect(res).to.equal(1)
        })

        it('COUNT should not count variables that have been SET with other value', function () {
            commandHandler.process('SET a 10')
            commandHandler.process('SET b 10')
            commandHandler.process('UNSET a')
            commandHandler.process('SET b 30')
            let res = commandHandler.process('COUNT 10')
            expect(res).to.equal(0)
        })

    })

    context('Part 2', () => {

        it('SET and GET should works inside a BEGIN transaction', function () {
            commandHandler.process('BEGIN')
            commandHandler.process('SET a 10')
            let res = commandHandler.process('GET a')
            expect(res).to.equal('10')
        })

        it('SET and GET should works inside a nested BEGIN transaction', function () {
            commandHandler.process('BEGIN')
            commandHandler.process('SET a 10')
            commandHandler.process('BEGIN')
            commandHandler.process('SET a 20')
            let res = commandHandler.process('GET a')
            expect(res).to.equal('20')

            commandHandler.process('ROLLBACK')
            res = commandHandler.process('GET a')
            expect(res).to.equal('10')

            commandHandler.process('ROLLBACK')
            res = commandHandler.process('GET a')
            expect(res).to.equal('NULL')
        })

        it('ROLLBACK when there is no open transaction should return "INVALID ROLLBACK"', function () {
            commandHandler.process('BEGIN')
            commandHandler.process('SET a 30')
            commandHandler.process('BEGIN')
            commandHandler.process('SET a 40')
            commandHandler.process('COMMIT')
            let res = commandHandler.process('GET a')
            expect(res).to.equal('40')

            res = commandHandler.process('ROLLBACK')
            expect(res).to.equal('INVALID ROLLBACK')
        })

        
        it('ROLLBACK a nested transaction and COMMIT previous work should behave correctly', function () {
            commandHandler.process('SET a 50')
            commandHandler.process('BEGIN')
            let res = commandHandler.process('GET a')
            expect(res).to.equal('50')

            commandHandler.process('SET a 60')
            commandHandler.process('BEGIN')
            commandHandler.process('UNSET a')
            res = commandHandler.process('GET a')
            expect(res).to.equal('NULL')

            res = commandHandler.process('ROLLBACK')
            expect(res).to.not.equal('INVALID ROLLBACK')

            res = commandHandler.process('GET a')
            expect(res).to.equal('60')

            commandHandler.process('COMMIT')
            res = commandHandler.process('GET a')
            expect(res).to.equal('60')
        })

        // line 185
        //'UNSET should works inside a BEGIN transaction'
        it('ROLLBACK when there is no open transaction should return "INVALID ROLLBACK"', function () {
            commandHandler.process('SET a 10')
            commandHandler.process('BEGIN')
            let res = commandHandler.process('COUNT 10')
            expect(res).to.equal(1)

            commandHandler.process('BEGIN')
            commandHandler.process('UNSET a')

            res = commandHandler.process('COUNT 10')
            expect(res).to.equal(0)

            res = commandHandler.process('ROLLBACK')
            expect(res).to.not.equal('INVALID ROLLBACK')

            res = commandHandler.process('COUNT 10')
            expect(res).to.equal(1)
        })
    })

})