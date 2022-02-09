const assert = require('assert');
const { postSetVote,
        postGetPRvoteStatus
      } = require('./../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote to stay open, then vote to close', function () {
    this.timeout(15000);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8949",
            /*contributor_id:*/ "7db9a",
            /*side:*/ "yes",
        );

    });
    describe('Check status after vote open', function () {
      it("Should do something", async () => {
        await snooze(1500);
        const status = await postGetPRvoteStatus(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8949",
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

    describe('Check status after vote open', function () {
      it("Should close vote after exceeding quorum", async () => {
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8949",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

        await snooze(1500);
        const status = await postGetPRvoteStatus(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8949",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

        assert.equal(
            status,
            "open",
            "Fail to stay open even the votes are below the quorum"
        );
      });
    });
});