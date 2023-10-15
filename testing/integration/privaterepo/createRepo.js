const assert = require("assert");
const {
	postGetVotePowerAmount,
	postCreateRepo,
	postGetContributorID,
} = require("../../../src/utils/requests");
const { getGithubContributor } = require("../../../src/utils/config");
const { getGithubToken } = require("../../../src/utils/gitHubUtil.js");

const { getNameSpaceRepo } = require("../../../src/utils/requests");

var snooze_ms = 5000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Create repo", function () {
	this.timeout(snooze_ms * 12);
	// Increase mocha(testing framework) time, otherwise tests fails
	before(async () => {});
	describe.only("Create repo", function () {
		it("Should create a turbosrc-namespace entry and create 1_000_000 VotePower in the turbosrc-engine with the ID from namespace", async () => {
			const contributor_name = await getGithubContributor();
			const token = await getGithubToken();

			//name space service
			const contributor_id = await postGetContributorID(
				/*owner:*/ contributor_name,
				/*repo:*/ "demo",
				/*defaultHash:*/ "",
				/*contributor_name:*/ contributor_name
			);

			const resCreateRepo = await postCreateRepo(
				/*owner:*/ contributor_name,
				/*repo:*/ "demo",
				/*defaultHash:*/ "",
				/*contributor:*/ contributor_id,
				/*side:*/ "",
				/*token:*/ token
			);

			const { status, repoID } = await getNameSpaceRepo(
				`${contributor_name}/demo`
			);

			await snooze(snooze_ms);

			const contributorTokenAmount = await postGetVotePowerAmount(
				/*owner:*/ contributor_name,
				/*repo:*/ repoID,
				/*defaultHash:*/ "",
				/*contributor:*/ contributor_id,
				/*side:*/ "no",
				/*token:*/ token
			);

			assert.equal(
				status,
				200 ,
				"Fail to create a namespace repo."
			);

			assert.deepEqual(
				contributorTokenAmount,
				{ status: 200, amount: 1_000_000 },
				"Fail to get amount."
			);

			assert.equal(Number(resCreateRepo.status), 201, "Fail to create repo.");
		});
	});
});
