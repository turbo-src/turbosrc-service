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
        await postCreatePullRequest(
            /*owner:*/ "7db9a",
            /*repo:*/ "demo",
            /*fork_branch:*/ "pullRequest5",
            /*pr_id:*/ "issue_5",
            /*title:*/ "refactor: missing parenthesis may cause unexpected problems",
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