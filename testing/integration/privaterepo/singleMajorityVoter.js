const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
        postGetPullRequest,
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
const {
       getGithubToken,
      } = require('../../../src/utils/gitHubUtil.js')

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote.', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        const contributor_name = await getGithubContributor()

        const tsrctester1ID = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_2",
            /*contributor:*/ "tsrctester1",
        );

        const testerTokenA = await getGithubToken("a")
        await snooze(snooze_ms);

        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*defaultHash:*/ "issue_2",
            /*childDefaultHash:*/ "issue_2",
	    /*mergeable:*/ true,
            /*contributor_id:*/ tsrctester1ID,
            /*side:*/ "yes",
	    /*token:*/ testerTokenA
        );

    });
    describe.only('A single majority voter votes.', function () {
      it("Should close vote and then merge.", async () => {
        const contributor_name = await getGithubContributor()
        const tsrctester1ID = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_2",
            /*contributor:*/ "tsrctester1",
        );

        await snooze(snooze_ms);

        const mergeStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*defaultHash:*/ "issue_2",
            /*contributor_id:*/ tsrctester1ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteYesTotals = await postGetPRvoteYesTotals(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*defaultHash:*/ "issue_2",
            /*contributor_id:*/ tsrctester1ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteNoTotals = await postGetPRvoteNoTotals(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*defaultHash:*/ "issue_2",
            /*contributor_id:*/ tsrctester1ID,
            /*side:*/ "yes",
        );

        assert.equal(
            tsrctester1ID,
            ""
        );

        //assert.deepEqual(
        //  mergeStatus,
        // { status: 200, state: "merge", "mergeableCodeHost": true, repo_id: `${contributor_name}/demo`,  fork_branch: "pullRequest2", "childDefaultHash": "8fff757c05b091712c8f170673b74c19134c34c4", "defaultHash": "8fff757c05b091712c8f170673b74c19134c34c4" },
        // { status: 200, type: 2 },
        //  "Fail to merge even though it was voted in."
        //);

        //assert.equal(
        //    voteYesTotals,
        //    "500001",
        //    "Fail to add votes yes."
        //);
        //assert.equal(
        //    voteNoTotals,
        //    "0",
        //    "Fail to zero out voteNoTotals after vote close."
        //);
      });
    });
});
