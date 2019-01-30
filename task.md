Using C# (Visual Studio project; VS Code; or LINQPad) or JavaScript (nodeJS or in browser) and send version 1 (the in-memory database) and version 2 (the in-memory database with Transactions) packaged separately.

 

You can use any third party dependencies you want (except for a database) - include a package.json or packages.config as needed.

 

-----

Part 1: In-Memory Database

Create a very simple in-memory database, which has a minimal command set.

All of the commands are going to be typed one command at a time, and then process the commands and perform whatever operation the command dictates.

 

Here are the commands to be performed:

    SET [name] [value]: Set a variable [name] to the value [value]. Neither variable names or values will ever contain spaces.
    GET [name]: Print out the value stored under the variable [name]. Print NULL if that variable name hasn't been set.
    UNSET [name]: Unset the variable [name]
    COUNT [value]: Return the count of variables equal to [value]. If no values are equal, this should output 0.
    END: Exit the program

 

Sample Input/Output

Here is a sample input and corresponding output:

> SET a 10

> GET a

10

> UNSET a

> GET a

NULL

> END

 

And another one:

> SET a 10

> SET b 10

> COUNT 10

2

> COUNT 20

0

> UNSET a

> COUNT 10

1

> SET b 30

> COUNT 10

0

> END

 

Part 2: Transactions

Now add in a few transactional features to help maintain data integrity. So there are 3 additional commands you will need to support:

    BEGIN: Open a transactional block
    ROLLBACK: Rollback all of the commands from the most recent transaction block. If no transactional block is open, print out INVALID ROLLBACK
    COMMIT: Permanently store all of the operations from any presently open transactional blocks

The database supports nested transactional blocks as you can tell by the above commands.

Remember, ROLLBACK only rolls back the most recent transaction block, while COMMIT closes all open transactional blocks.

Any command issued outside of a transactional block commits automatically.

 

Sample Input/Output

Here are some sample inputs and expected outputs using these new commands:

> BEGIN

> SET a 10

> GET a

10

> BEGIN

> SET a 20

> GET a

20

> ROLLBACK

> GET a

10

> ROLLBACK

> GET a

NULL

> END

 

> BEGIN

> SET a 30

> BEGIN

> SET a 40

> COMMIT

> GET a

40

> ROLLBACK

INVALID ROLLBACK

> END

 

> SET a 50

> BEGIN

> GET a

50

> SET a 60

> BEGIN

> UNSET a

> GET a

NULL

> ROLLBACK

> GET a

60

> COMMIT

> GET a

60

> END

 

> SET a 10

> BEGIN

> COUNT 10

1

> BEGIN

> UNSET a

> COUNT 10

NULL

> ROLLBACK

> COUNT 10

1

> END