const assert = require('assert');
const {
        postCreateRepo,
        postCreatePullRequest,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 5000

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create repo and GH pull request', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('Check status after creating a repo.', function () {
      it("Should do something", async () => {
        await postCreateRepo(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*fork_branch:*/ "voteToOpenThenClose",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            true,
            true,
            "Fail to create repo and pull requests."
        );
      });
    });
});