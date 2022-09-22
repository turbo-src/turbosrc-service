const assert = require('assert');
const { postSetVote,
        postGetPullRequest,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postCreateRepo,
        postNewPullRequest
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote to close', function () {
    this.timeout(15000);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        await postCreateRepo(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash8949",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postNewPullRequest(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash8949",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash8949",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

    });
    describe.only('Duplicate pull request.', function () {
      it("Should not allow reopen a closed pull request.", async () => {
        await snooze(1500);
        const status = await postGetPullRequest(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash8949",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postNewPullRequest(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash8949",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash8949",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );
        await snooze(1500);
        const statusDuplicatePR = await postGetPullRequest(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash8949",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );

        assert.equal(
            status,
            "closed",
            "Fail to stay close even the votes exceed the quorum"
        );

        assert.equal(
            statusDuplicatePR,
            "closed",
            "Duplicate pull request."
        );

      });
    });
});