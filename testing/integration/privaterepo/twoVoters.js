const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
        postGetPRvoteStatus,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postGetPRvoteTotals,
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
        const contributor_name = await getGithubContributor()
        await snooze(snooze_ms);
        const contributor_id = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash4",
            /*contributor_name:*/ contributor_name,
        );

        await snooze(snooze_ms);
        //user
        const voteRes = await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteYesTotals = await postGetPRvoteYesTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteNoTotals = await postGetPRvoteNoTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        const voteTotals = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const openStatus = await postGetPRvoteStatus(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor:*/ contributor_name,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);

        const maryID = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash4",
            /*contributor:*/ "mary",
        );

        //mary
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor_id:*/ maryID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const mergeStatus = await postGetPRvoteStatus(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor_id:*/ maryID,
            /*side:*/ "yes",
        );

        const voteTotalsFinal = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );

        //console.log(status)
        assert.equal(
            voteRes,
            "open",
            "Fail to vote."
        );
        assert.equal(
            voteYesTotals,
            '34000',
            "Fail to add votes yes."
        );
        assert.equal(
            voteNoTotals,
            '0',
            "Fail to add votes no."
        );
        assert.equal(
            voteTotals, '0.034', "Fail to add votes no."
        );
        assert.equal(
            openStatus,
            "open",
            "Fail to stay open."
        );
        assert.equal(
            voteTotalsFinal,
            '0.534001',
            "Fail to tally all votes."
        );

        assert.deepEqual(
          mergeStatus,
         { status: 200, type: 2 },
          "Fail to merge even though it was voted in."
        );
      });
    });
});
