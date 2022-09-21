const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
        postGetPRvoteStatus,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postCreateRepo,
        postNewPullRequest,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../src/utils/config')

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote.', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        const contributor_name = await getGithubContributor()
        await snooze(snooze_ms);

        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*defaultHash:*/ "defaultHash6",
            /*contributor_id:*/ "0x18F0Ef5F737ccD11B439D52E4c4be5ed8Cd7Ca8E", // test user
            /*side:*/ "yes",
        );

    });
    describe.only('A single majority voter votes.', function () {
      it("Should close vote and then merge.", async () => {
        const contributor_name = await getGithubContributor()
        await snooze(snooze_ms);

        const mergeStatus = await postGetPRvoteStatus(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*defaultHash:*/ "defaultHash6",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteYesTotals = await postGetPRvoteYesTotals(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*defaultHash:*/ "defaultHash6",
            /*contributor:*/ contributor_name,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteNoTotals = await postGetPRvoteNoTotals(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*defaultHash:*/ "defaultHash6",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

        assert.deepEqual(
          mergeStatus,
         { status: 200, type: 2 },
          "Fail to merge even though it was voted in."
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
