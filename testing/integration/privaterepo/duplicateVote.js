const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateRepo,
        postSetVote,
        postGetPullRequest,
        postNewPullRequest,
        postGetContributorID,
        postGetContributorName
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
        const contributor_name = await getGithubContributor()
        await snooze(snooze_ms);
        const contributor_id = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash4",
            /*contributor_name:*/ contributor_name,
        );

        //user
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_3",
            /*childDefaultHash:*/ "issue_3",
	    /*mergeable:*/ true,
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const openStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_3",
            /*contributor:*/ contributor_name,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        //user
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_3",
            /*childDefaultHash:*/ "issue_3",
	    /*mergeable:*/ true,
            /*contributor:*/ contributor_id,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const duplicateStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_3",
            /*childDefaultHash:*/ "issue_3",
	    /*mergeable:*/ true,
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
            /*defaultHash:*/ "issue_3",
            /*childDefaultHash:*/ "issue_3",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x09EAF54C0fc9F2b077ebC96e3FeD47051f7fb626",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const mergeStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_3",
            /*contributor:*/ contributor_name,
            /*side:*/ "yes",
        );

        assert.deepEqual(
          openStatus,
         { status: 200, state: "open", repo_id: `${contributor_name}/demo`,  fork_branch: "pullRequest3", "childDefaultHash": "f69d18f0fde201d83ce5de571168d7649aabc940", "defaultHash": "f69d18f0fde201d83ce5de571168d7649aabc940" },
          "Fail open on initial vote below quorum"
        );

        assert.deepEqual(
          duplicateStatus,
         { status: 200, state: "open", repo_id: `${contributor_name}/demo`,  fork_branch: "pullRequest3", "childDefaultHash": "f69d18f0fde201d83ce5de571168d7649aabc940", "defaultHash": "f69d18f0fde201d83ce5de571168d7649aabc940" },
          "Fail keep open even though initial vote below quorum"
        );
        assert.deepEqual(
          mergeStatus,
         { status: 200, state: "merge", repo_id: `${contributor_name}/demo`,  fork_branch: "pullRequest3", "childDefaultHash": "f69d18f0fde201d83ce5de571168d7649aabc940", "defaultHash": "f69d18f0fde201d83ce5de571168d7649aabc940" },
          "Fail to merge even though it was voted in."
        );
      });
    });
});
