const assert = require('assert');
const {
        postCreateRepo,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 5000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote duplicate with minority stake voter', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    describe('Check status after vote duplicate', function () {
      it("Should do something", async () => {
        await postCreateRepo(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postNewPullRequest(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postSetVote(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const openStatus = await postGetPRvoteStatus(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postSetVote(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const duplicateStatus = await postGetPRvoteStatus(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );

        // Close vote otherwise other tests on same server instance won't work.
        // Only one vote round at a time.
        await snooze(snooze_ms);
        await postSetVote(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const closeStatus = await postGetPRvoteStatus(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );

        //console.log(status)
        assert.equal(
            openStatus,
            "open",
            "Fail open on initial vote below quorum"
        );

        assert.equal(
            duplicateStatus,
            "open",
            "Fail keep open even though initial vote below quorum"
        );
        assert.equal(
            closeStatus,
            "closed",
            "Fail to close even the votes exceed the quorum"
        );
      });
    });
});