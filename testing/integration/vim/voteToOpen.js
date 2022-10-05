const assert = require('assert');
const { postSetVote,
        postGetPullRequest,
        postCreateRepo,
        postNewPullRequest
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote to stay open', function () {
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
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );

    });
    describe.only('Check status after vote open', function () {
      it("Should do something", async () => {
        await snooze(1500);
        const status = await postGetPullRequest(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*defaultHash:*/ "defaultHash8949",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            status,
            "open",
            "Fail to stay open even the votes are below the quorum"
        );
      });
    });
});