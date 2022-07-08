const assert = require('assert');
const {
        postCreateRepo,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest
      } = require('../../../utils/requests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create repo', function () {
    this.timeout(15000);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        await postCreateRepo(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8457",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postNewPullRequest(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8457",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
    });
    describe.only('Check status after creating a repo.', function () {
      it("Should do something", async () => {
        await snooze(1500);
        const status = await postGetPRvoteStatus(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8457",
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