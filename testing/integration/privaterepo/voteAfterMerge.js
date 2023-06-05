const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
        postGetPullRequest,
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
      const {socket} = require("../../../socketConfig")

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
        const mergeStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor_id:*/ "",
            /*side:*/ "yes",
        );

        const voteTotalsFinal = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );
	// Vote after merge by 'mb' shouldn't be possible.
        await snooze(snooze_ms);
        const afterMergeVoteRes = await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor_id:*/ "0x232b9E710e897aEb18FEbe410526B987641BaE5f",
            /*side:*/ "yes",
        );
        socket.emit('vote cast', contributor_name, "demo", "defaultHash1")

        await snooze(snooze_ms);
        const afterMergeStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor_id:*/ maryID,
            /*side:*/ "yes",
        );

        const voteTotalsAfterMerge = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash1",
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );
        socket.disconnect()

        assert.equal(
            voteTotalsFinal,
            '0.534001',
            "Fail to tally all votes."
        );

        assert.deepEqual(
          mergeStatus,
         { status: 200, state: "merge", repo_id: `${contributor_name}/demo`,  fork_branch: "pullRequest1", "childDefaultHash": "defaultHash1", "defaultHash": "defaultHash1" },
          "Fail to merge even though it was voted in."
        );

        assert.equal(
            voteTotalsAfterMerge,
            '0.534001',
            "Fail to tally all votes."
        );

        assert.equal(
            afterMergeVoteRes,
            404,
            "Fail to vote."
        );

        assert.deepEqual(
          afterMergeVoteRes,
         { status: 200, state: "merge", repo_id: `${contributor_name}/demo`,  fork_branch: "pullRequest1", "childDefaultHash": "defaultHash1", "defaultHash": "defaultHash1" },
          "Fail to merge even though it was voted in."
        );
      });
    });
});
