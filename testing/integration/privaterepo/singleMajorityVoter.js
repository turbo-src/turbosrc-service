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
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../utils')

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
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "0x09EAF54C0fc9F2b077ebC96e3FeD47051f7fb626",
            /*side:*/ "yes",
        );

    });
    describe.only('A single majority voter votes.', function () {
      it("Should close vote and then merge.", async () => {
        const contributor_name = await getGithubContributor()
        await snooze(snooze_ms);

        const status = await postGetPRvoteStatus(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteYesTotals = await postGetPRvoteYesTotals(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*pr_id:*/ "issue_2",
            /*contributor:*/ contributor_name,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteNoTotals = await postGetPRvoteNoTotals(
            /*owner:*/ contributor_name,
            /*repo: */ "demo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            status,
            "merge",
            "Fail to stay close even though it was voted in."
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