const assert = require('assert');
const { postSetVote,
        postGetPullRequest,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postGetPRvoteTotals,
        postCreateRepo,
        postNewPullRequest
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote to stay open, then close', function () {
    this.timeout(15000);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        await postCreateRepo(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash6598",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postNewPullRequest(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash6598",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash6598",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );

    });
    describe('Check status after vote close', function () {
      it("Should do something", async () => {
        await snooze(1500);
        const voteYesTotals = await postGetPRvoteYesTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash6598",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const voteNoTotals = await postGetPRvoteNoTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash6598",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        const voteTotals = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash6598",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const openStatus = await postGetPullRequest(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash6598",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash6598",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const closeStatus = await postGetPullRequest(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash6598",
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
            "Fail to close even the votes exceed the quorum"
        );

        assert.equal(
            closeStatus,
            "closed",
            "Fail to close even the votes exceed the quorum"
        );
      });
    });
});