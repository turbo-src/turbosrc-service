const assert = require("assert");
const { findOrCreateNameSpaceRepo } = require("../../../src/utils/requests");
const { getGithubContributor } = require("../../../src/utils/config");
const { getGithubToken } = require("../../../src/utils/gitHubUtil.js");

var snooze_ms = 5000;

describe("findOrCreateNameSpaceRepo", function () {
	this.timeout(snooze_ms * 12);
	before(async () => {});
	describe.only("findOrCreateNameSpaceRepo", function () {
		it("Should create a repo in the namespace server for indexing", async () => {
			const contributorName = await getGithubContributor();
			const nameSpaceRepo = await findOrCreateNameSpaceRepo(
				`${contributorName}/demo`,
				""
			);
			assert.equal(
				nameSpaceRepo.status,
				201,
				"Fail to create a repo in the namespace service."
			);
		});
	});
});
