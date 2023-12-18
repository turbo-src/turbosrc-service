const assert = require("assert");
const {
	getNameSpaceRepo,
	postGetRepoData,
	postGetContributorID,
	postGetVotes,
} = require("../../../src/utils/requests");
const { getGithubContributor } = require("../../../src/utils/config");

describe("Conflict", function () {
	it("Should return a PR in a state of 'conflict'", async () => {
		const contributor_name = await getGithubContributor();
		const contributorID = await postGetContributorID(
			contributor_name,
			"",
			"",
			contributor_name
		);
		const { repoID } = await getNameSpaceRepo(
			`${contributor_name}/demo`,
			contributorID
		);
		const issueID = "issue_6";

		const beforeConflict = await postGetVotes(repoID, issueID, contributorID);

		// Insert script to throw PR 6 into conflict here:

		// Then check its state again:
		// NB - Checking if a PR is in conflict only occurs in getRepoData because that is what our front end references
		// when rendering the vote status buttons. Calling getVotes will just return the state which is stored in our DB,
		// not referencing GitHub.

		const { pullRequests } = await postGetRepoData(repoID, contributorID);
		const [afterConflict] = pullRequests.filter((pr) => pr.issueID !== issueID);

		assert.equal(
			beforeConflict.state,
			"vote",
			"Failed to get pull request 6's state of 'vote'"
		);
		assert.equal(
			afterConflict.state,
			"conflict",
			"Failed to get pull request 6's state of 'conflict'"
		);
	});
});
