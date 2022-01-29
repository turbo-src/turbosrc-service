const assert = require('assert');
const { postSetVote,
        postGetPRvoteStatus
      } = require('./../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote to close', function () {
    this.timeout(15000);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        await snooze(1500);
        await postSetVote(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8949",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

    });
    describe.only('Check status after vote open', function () {
      it("Should do something", async () => {
        await snooze(1500);
        const status = await postGetPRvoteStatus(
            /*owner:*/ "vim",
            /*repo:*/ "vim",
            /*pr_id:*/ "issue_8949",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            status,
            "closed",
            "Fail to stay close even the votes exceed the quorum"
        );
      });
    });
});