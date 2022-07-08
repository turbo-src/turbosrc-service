const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateRepo,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest,
        postGetContributorTokenAmount,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../graphQLrequests')
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
        const user  = await getGithubContributor();

        await snooze(snooze_ms);
        const contributorTokenAmountRes = await postGetContributorTokenAmount(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_4",
            /*contributor:*/ "mary",
            /*side:*/ "no",
        );

        const contributorTokenAmount = Number(contributorTokenAmountRes)

        console.log(contributorTokenAmountRes)
        assert.equal(
            contributorTokenAmount,
            500001,
            "Fail to get token amount."
        );
      });
    });
});