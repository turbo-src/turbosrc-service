const assert = require('assert');
const { postSetVote,
        postGetPRvoteStatus
      } = require('./../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 300;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote', function () {
    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(15000);

    before(async () => {

    });
    describe('Vote up but do not close', function () {
      it("Should increment vote", async () => {
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8949",
            /*contributor_id:*/ "79b9a",
            /*side:*/ "yes",
        );
        const status = await postGetPRvoteStatus(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8949",
            /*contributor_id:*/ "79b9a",
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            status,
            "open",
            "Fail to stay open even the votes less than quorum"
        );
      });
    });
    describe.only('Check status before vote open', function () {
      it("Should do something", async () => {
        const status = await postGetPRvoteStatus(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8949",
            /*contributor_id:*/ "79b9a",
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            status,
            "open",
            "Fail to stay open even the votes less than quorum"
        );
      });
    });
});