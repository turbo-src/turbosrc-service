The `createSystem.js` is a testing script file for contributing to a private repository:

1. **Token Management**: It tests the system's ability to create a repo named "demo" owned by a Github user, allows a contributor ("mary") to transfer various amounts of tokens to different users, and then verifies if the correct amounts are received.

2. **Get Token Amounts**: It verifies if the contributor token amounts for each user align with the predefined amounts by performing various `postGetContributorTokenAmount` requests.

3. **Name Validation**: It fetches both "mary" and the Github user's respective contributor names and checks their validity via a testing assertion.

This script applies the Mocha testing framework. Its `describe.only` call indicates it will only run this particular suite of tests while skipping others in the same testing environment. 

It employs async calls extensively, hence, it uses a custom 'snooze' function to manage delays and prevent data races due to asynchronous operations. The purpose of these async calls is to execute each step of the test (posting a request, transferring tokens, and asserting results), in a sequential, coherent fashion to ensure accurate results.