const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetContributorTokenAmount,
        postCreateRepo,
        getRepoStatus,
        postGetContributorID,
        postGetContributorName,
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

	//name space service
        const contributor_id = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "",
            /*contributor_name:*/ contributor_name,
        );
        const resCreateRepo = await postCreateRepo(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "",
            /*contributor:*/ contributor_id,
            /*side:*/ "",
        );

        const resRepoStatus = await getRepoStatus(`${contributor_name}/demo`);

        await snooze(snooze_ms);
        const contributorTokenAmount = await postGetContributorTokenAmount(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "",
            /*contributor:*/ contributor_id,
            /*side:*/ "no",
        );

        assert.deepEqual(
            contributorTokenAmount,
	    { status: 200, amount: 1_000_000 },
            "Fail to get amount."
        );

        assert.equal(
	    Number(resCreateRepo),
            201,
            "Fail to create repo."
        );

        assert.deepEqual(
	    resRepoStatus,
	    { status: 200, exists: true },
            "Fail to get correct repo status."
        );
      });
    });
})
