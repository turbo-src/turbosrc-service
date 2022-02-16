const assert = require('assert');
const { postSetVote,
        postGetPRvoteStatus,
        postGetPRvoteTotals
      } = require('./../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote and get tally', function () {
    this.timeout(100_000);
    // Increase mocha(testing framework) time, otherwise tests fails
    describe('Check status after vote duplicate', function () {
      it("Should do something", async () => {
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const sevenDbVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "am",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const amDbVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "am",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "jc",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const jcVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "jc",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "pc",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const pcVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "pc",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "mb",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const mbVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "mb",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "np",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const npVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "np",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "nn",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const nnVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "nn",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "jp",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const jpVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "jp",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "ts",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const tsVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "ts",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "af",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const afVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "af",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "ds",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const dsVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "ds",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "ri",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const riVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_6519",
            /*contributor_id:*/ "ri",
            /*side:*/ "yes",
        );
        assert.equal(
            sevenDbVoteCumm,
            "0.033999",
            "Fail to add votes."
        );
        //assert.equal(
        //    amVoteCumm =
        //    "0.15000",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    jcVoteCumm =
        //    "0.10000",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    pcVoteCumm =
        //    "0.75000",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    mbVoteCumm =
        //    "0.5000",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    npVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    nnVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    jpVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    tsVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    afVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    dsVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        assert.equal(
            riVoteCumm,
            "0.499999",
            "Fail to add votes."
        );
      });
    });
});