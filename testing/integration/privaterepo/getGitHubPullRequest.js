const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetVotePowerAmount,
        postCreateRepo,
        getRepoStatus,
        postGetContributorID,
        postGetContributorName,
        getGitHubPullRequest
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../src/utils/config')

//const {
//  getGitHubPullRequest,
//} = require("../../../src/utils/gitHubUtil");

var snooze_ms = 5000

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Pull request', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('Pull request', function () {
      it("Should get pull request 1", async () => {
        const contributor_name = await getGithubContributor()

	//name space service
        const gitHubPullRequest =
	    await getGitHubPullRequest(
            /*owner:*/ "7db9a",
            /*repo:*/ "demo",
	    "issue_1",
      "0x18F0Ef5F737ccD11B439D52E4c4be5ed8Cd7Ca8E"
	    )
        console.log(gitHubPullRequest)
        assert.equal(
            gitHubPullRequest.mergeable,
		    true , // Github can return null, but module converts null to false
            "Failed to be mergeable."
        );
        assert.equal(
            gitHubPullRequest.state,
	    "open",
            "Failed to be mergeable."
        );

	//gitHubPullRequest.merge_commit_sha == head
        assert.equal(
            gitHubPullRequest.mergeCommitSha,
	    // when PR is open it is "264e4bfe8ce188e2e7b0ad9d6250c75d9bcef468",
	    // Does it stay the same if it was rebased and commited, via option on Github.
	    "22d729a304649327fb2fb33b74308f6820366de3", // Same as head after commit.
            "Failed to merge commit sha."
        );
        assert.equal(
            gitHubPullRequest.baseBranch, // base branch
	    "master",
            "Failed to get base branch."
        );

      });
    });
})
