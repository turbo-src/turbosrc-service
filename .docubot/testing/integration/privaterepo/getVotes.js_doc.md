File: getVotes.js 

This file is part of the integration test suite and is responsible for testing the `getVotes` function from the `engineRequests` utility file. The function retrieves all votes for a given Pull Request (PR), identified by its repository ID and default hash.

Key components:
1. `snooze` function: Used to introduce delay before each test to avoid data duplication errors.
2. `before` setup action: There is a setup hook where additional setup could be placed if needed, but it is currently empty.
3. `describe.only('getVotes')`: Outlines the suite of tests specifically for the `getVotes` method.
4. `it("Should get all of the votes for a given PR...": Is a single test case that checks if the function correctly retrieves all votes for a provided PR. It first retrieves the contributor name, then runs the `getVotes` function with the path `${contributor_name}/demo` and 'issue_2' as parameters. The result's status code is then checked to be 200, indicating a successful retrieval of votes. If not, a failure message is displayed.
   
Notice: The designated timeout value is `snooze_ms*12`, i.e. 12 times the defined snooze delay.