The file `/app/filebot-store-000/turbosrc-service/src/utils/requests.js` contains JavaScript code that exports an object named `root`. This object has various methods that make HTTP requests using the `superagent` library. These requests interact with a GraphQL API to perform actions related to a TurboSrc service.

Here are some of the main methods defined in this file:

- `postCreateRepoTestDB`: Creates a new repository using the `createRepo` mutation.
- `postCreateTokenSupplyTestDB`: Creates a new token supply using the `createTokenSupply` mutation.
- `postSetTSrepoHeadTestDB`: Sets the head of a repository using the `setTSrepoHead` mutation.
- `postSetQuorumTestDB`: Sets the quorum of a repository using the `setQuorum` mutation.
- `postNewPullRequestTestDB`: Creates a new pull request using the `newPullRequest` mutation.
- `postCreateUser`: Creates a new user using the `createUser` mutation.
- `postGetContributorName`: Retrieves the name of a contributor using the `getContributorName` query.
- `postGetContributorID`: Retrieves the ID of a contributor using the `getContributorID` query.
- `postGetContributorSignature`: Retrieves the signature of a contributor using the `getContributorSignature` query.
- `postCreateRepo`: Creates a new repository using the `createRepo` mutation.
- `getUser`: Retrieves user information using the `getUser` query.
- `findOrCreateUser`: Retrieves or creates a user using the `findOrCreateUser` mutation.
- `postGetVotePowerAmount`: Retrieves the vote power amount of a user using the `getVotePowerAmount` query.
- `postTransferTokens`: Transfers tokens using the `transferTokens` mutation.
- `postNewPullRequest`: Creates a new pull request using the `newPullRequest` mutation.
- `postSetVote`: Sets a vote for a pull request using the `setVote` mutation.
- `getRepoStatus`: Retrieves the status of a repository using the `getRepoStatus` query.
- `get_authorized_contributor`: Retrieves information about an authorized contributor using the `getAuthorizedContributor` query.
- `postPullFork`: Pulls a fork of a repository using the `getPRfork` query.
- `postGetPRforkStatus`: Retrieves the status of a forked pull request using the `getPRforkStatus` query.
- `postGetPullRequest`: Retrieves information about a pull request using the `getPullRequest` query.
- `getGitHubPullRequest`: Retrieves information about a GitHub pull request using the `getGitHubPullRequest` query.
- `postGetPRpercentVotedQuorum`: Retrieves the percentage of votes and quorum for a pull request using the `getPRpercentVotedQuorum` query.
- `postGetPRvoteTotals`: Retrieves the vote totals for a pull request using the `getPRvoteTotals` query.
- `postGetPRvoteYesTotals`: Retrieves the "yes" vote totals for a pull request using the `getPRvoteYesTotals` query.
- `postGetPRvoteNoTotals`: Retrieves the "no" vote totals for a pull request using the `getPRvoteNoTotals` query.
- `postClosePullRequest`: Closes a pull request using the `closePullRequest` mutation.
- `postMergePullRequest`: Merges a pull request using the `mergePullRequest` mutation.
- `postCreateTsrcPullRequest`: Creates a pull request in TurboSrc using the `createTsrcPullRequest` mutation.
- `postFork`: Forks a repository using the `fork` mutation.
- `postSetContributorVotedTokensTestDB`: Sets the voted tokens for a contributor using the `setContributorVotedTokens` mutation.
- `postAddToTotalVotedYesTokensDB`: Adds to the total "yes" voted tokens for a pull request using the `addToTotalVotedYesTokens` mutation.

These methods are used to perform various actions on the TurboSrc service, such as creating repositories, pulling forks, setting votes, retrieving user and pull request information, and more. The exact behavior and input parameters for each method can be determined by examining the GraphQL queries and mutations being sent in the requests.