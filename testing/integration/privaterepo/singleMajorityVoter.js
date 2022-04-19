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

describe('Vote.', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        await postSetVote(
            /*owner:*/ "turbo-src",
            /*repo: */ "testrepo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

    });
    describe.only('A single majority voter votes.', function () {
      it("Should close vote and then merge.", async () => {
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
            "merge",
            "Fail to stay close even though it was voted in."
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