const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetRepoStatus,
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../src/utils/config')

var snooze_ms = 5000

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create repo', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('Create repo', function () {
      it("Should do create repo", async () => {
        const contributor_name = await getGithubContributor()

        const resRepoStatus = await postGetRepoStatus(`${contributor_name}/demo`);


	console.log(resRepoStatus)
        assert.deepEqual(
	    resRepoStatus,
	    { status: 200, exists: true },
            "Fail to get correct repo status."
        );
      });
    });
})
