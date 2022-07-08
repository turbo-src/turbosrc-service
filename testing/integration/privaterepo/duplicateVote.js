const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateRepo,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest,
        postGetContributorID,
        postGetContributorName
      } = require('../../../utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../utils/config')

var snooze_ms = 1500;;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('vote', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    describe('Vote duplicate with minority voter', function () {
      it("Prevent duplicate vote", async () => {
        const contributor_name = await getGithubContributor()
        await snooze(snooze_ms);
        const contributor_id = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_4",
            /*contributor_name:*/ contributor_name,
        );

        //user
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const openStatus = await postGetPRvoteStatus(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ contributor_name,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        //user
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const duplicateStatus = await postGetPRvoteStatus(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ contributor_name,
            /*side:*/ "yes",
        );

        // Close vote otherwise other tests on same server instance won't work.
        // Only one vote round at a time.
        await snooze(snooze_ms);
        //mary
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor_id:*/ "0x09EAF54C0fc9F2b077ebC96e3FeD47051f7fb626",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const mergeStatus = await postGetPRvoteStatus(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ contributor_name,
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
            mergeStatus,
            "merge",
            "Fail to merge even though voted in."
        );
      });
    });
});