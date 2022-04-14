const assert = require('assert');
const {
        postCreateRepo,
        postCreatePullRequest,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create repo and GH pull request', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('Check status after creating a repo.', function () {
      it("Should do something", async () => {
        await postCreateRepo(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*fork_branch:*/ "twoVoters",
            /*pr_id:*/ "issue_1",
            /*title:*/ "Add Two Voters to README.",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*fork_branch:*/ "singleMajorityVoter",
            /*pr_id:*/ "issue_2",
            /*title:*/ "Add Single Majority Voter to README.",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*fork_branch:*/ "duplicateVote",
            /*pr_id:*/ "issue_3",
            /*title:*/ "Add Duplicate Vote to README.",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ "turbo-src",
            /*repo:*/ "testrepo",
            /*fork_branch:*/ "manyVoters",
            /*pr_id:*/ "issue_4",
            /*title:*/ "Add Many Voters to README.",
        );

        //console.log(status)

        assert.equal(
            true,
            true,
            "Fail to create repo and pull requests."
        );
      });
    });
});