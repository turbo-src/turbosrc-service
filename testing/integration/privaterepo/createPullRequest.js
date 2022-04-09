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

describe('Create repo', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        await postCreateRepo(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_7",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
    });
    describe.only('Check status after creating a repo.', function () {
      it("Should do something", async () => {
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*fork_branch:*/ "createPullRequestTest",
            /*pr_id:*/ "issue_8",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postNewPullRequest(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_8",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const status = await postGetPRvoteStatus(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_8",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            status,
            "open",
            "Fail to stay open even the votes are below the quorum"
        );
      });
    });
});