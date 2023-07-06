const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
        postGetPullRequest,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postCreateRepo,
        postNewPullRequest,
        postClosePullRequest,
        postMergePullRequest,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../src/utils/config')

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Pull requests', function () {
    this.timeout(15000);
    // Increase mocha(testing framework) time, otherwise tests fails
    //before(async () => {
    //    await postCreateRepo(
    //        /*owner:*/ "vim",
    //        /*repo:*/ "vim",
    //        /*defaultHash:*/ "defaultHash4955",
    //        /*contributor:*/ contributor_name,
    //        /*side:*/ true,
    //    );
    //});
    describe.only('Merge pull request.', function () {
      it("Should merge pull request.", async () => {
        const contributor_name = await getGithubContributor()
        await snooze(1500);

        await postMergePullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash8",
            /*contributor:*/ contributor_name,
            /*side:*/ true,
        );
        assert.equal(
            true,
            false,
            "fail to merge pull request"
        );

        //assert.equal(
        //    statusDuplicatePR,
        //    "closed",
        //    "Duplicate pull request."
        //);

      });
    });
});