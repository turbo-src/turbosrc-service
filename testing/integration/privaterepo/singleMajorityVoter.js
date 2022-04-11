const assert = require('assert');
const { postSetVote,
        postGetPRvoteStatus,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postCreateRepo,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote to close', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        await postCreateRepo(
            /*owner:*/ "turbo-src",
            /*repo: */ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postNewPullRequest(
            /*owner:*/ "turbo-src",
            /*repo: */ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postSetVote(
            /*owner:*/ "turbo-src",
            /*repo: */ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

    });
    describe.only('Check status after vote open', function () {
      it("Should do something", async () => {
        await snooze(snooze_ms);
        const status = await postGetPRvoteStatus(
            /*owner:*/ "turbo-src",
            /*repo: */ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteYesTotals = await postGetPRvoteYesTotals(
            /*owner:*/ "turbo-src",
            /*repo: */ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteNoTotals = await postGetPRvoteNoTotals(
            /*owner:*/ "turbo-src",
            /*repo: */ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            status,
            "closed",
            "Fail to stay close even the votes exceed the quorum"
        );

        assert.equal(
            voteYesTotals,
            "0",
            "Fail to add votes yes."
        );
        assert.equal(
            voteNoTotals,
            "0",
            "Fail to zero out voteNoTotals after vote close."
        );
      });
    });
});