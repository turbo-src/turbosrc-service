const assert = require('assert');
const { postSetVote,
        postGetPRvoteStatus,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postGetPRvoteTotals,
        postCreateRepo,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1500;;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Voting.', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe('Two voters vote - exceed quorum.', function () {
      it("Should close open and close vote, then merge.", async () => {
        await snooze(snooze_ms);
        await postSetVote(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteYesTotals = await postGetPRvoteYesTotals(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteNoTotals = await postGetPRvoteNoTotals(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        const voteTotals = await postGetPRvoteTotals(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const openStatus = await postGetPRvoteStatus(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postSetVote(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const mergeStatus = await postGetPRvoteStatus(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

        //console.log(status)
        assert.equal(
            voteYesTotals,
            '33999',
            "Fail to add votes yes."
        );
        assert.equal(
            voteNoTotals,
            '0',
            "Fail to add votes no."
        );
        assert.equal(
            voteTotals,
            '0.033999',
            "Fail to add votes no."
        );
        assert.equal(
            openStatus,
            "open",
            "Fail to stay open."
        );

        assert.equal(
            mergeStatus,
            "merge",
            "Fail to merge even though it was voted in."
        );
      });
    });
});