Title: Duplicate Vote Test in TurboSrc Service

This file (`duplicateVote.js`) is a test script for the 'vote' feature of a GitHub private repository interface using Node.js. The file is located in the integration testing section of the `turbosrc-service`.

The script tests the specific case of trying to cast a duplicate vote on a 'pull request' in the context where the voter is in the minority. It ensures the system prevents such actions and handles them correctly.

The script uses the Mocha testing framework, various utilities from the local `utils` directory, and GraphQL for queries. The use of the `assert` module is for test assertions.

Key testing scenarios covered herein include:

- Acquiring the contributor information (name, identification, token)
- Sending a vote for a particular pull request
- Attempting to cast a duplicate vote
- Checking the status of the vote after each operation
- Closing the vote to ensure other tests can be performed

Important:
1. The system enforces a delay (snooze) between each operation to prevent data races.
2. Only one voting round can be active at any given time in the system.

This test script ensures the integrity of the GitHub private repo voting system within the TurboSrc service.