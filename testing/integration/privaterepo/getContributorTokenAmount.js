const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateRepo,
        postSetVote,
        postNewPullRequest,
        postGetVotePowerAmount,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../src/utils/config')

var snooze_ms = 1500;;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('vote', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    describe('Vote duplicate with minority voter', function () {
      it("Prevent duplicate vote", async () => {
        const user  = await getGithubContributor();

        await snooze(snooze_ms);
        const contributorTokenAmount = await postGetVotePowerAmount(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash4",
            /*contributor:*/ "0x09EAF54C0fc9F2b077ebC96e3FeD47051f7fb626",
            /*side:*/ "no",
        );

        assert.deepEqual(
            contributorTokenAmount,
	    { status: 200, amount: 500001 },
            "Fail to get token amount."
        );
      });
    });
});
