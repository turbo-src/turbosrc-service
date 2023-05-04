const assert = require('assert');
const {
        getVotes,
      } = require('../../../src/utils/engineRequests')

var snooze_ms = 5000

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('getVotes', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('getVotes', function () {
      it("Should get all of the votes for a given PR based on its repo id and defaultHash", async () => {
        const contributor_name = await getGithubContributor()
        const resGetVotes = await getVotes(`${contributor_name}/demo`, 'issue_2');

        assert.deepEqual(
	    resGetVotes.status,
	    200,
        "Fail to get votes for a given PR based on its repo id and defaultHash."
        );
      });
    });
})
