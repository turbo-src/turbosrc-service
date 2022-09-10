const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetContributorTokenAmount,
        postCreateRepo,
        getRepoStatus,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../src/utils/config')
const {
        getPullRequestExperiment
      } = require('../../../src/utils/gitHubUtil')

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
        const contributor_id = await postGetContributorID(
            /*owner:*/ "turbo-src",
            /*repo:*/ "git-service",
            /*pr_id:*/ "issue_4",
            /*contributor_name:*/ contributor_name,
        );
        const pullRequest =
	    await getPullRequestExperiment(
		contributor_name,
		"demo",
		1
	    )
        console.log(pullRequest)
        assert.equal(
            pullRequest.mergeable,
	    true,
            "Failed to be mergeable."
        );
        assert.equal(
            pullRequest.merge_commit_sha,
	    "e87ca22181f60e2392edc6675100f5a62a51a95",
            "Failed to be mergeable."
        );

      });
    });
})
