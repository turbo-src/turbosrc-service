const assert = require("assert");
const {
	postSetVote,
	postGetPullRequest,
	postGetPRvoteYesTotals,
	postGetPRvoteNoTotals,
	postGetPRvoteTotals,
	postGetContributorID,
	getNameSpaceRepo,
} = require("../../../src/utils/requests");
const { getGithubContributor } = require("../../../src/utils/config");
const {
	getGitHubToken,
	createGitHubCommit,
	mergePullRequest,
	createPullRequest,
	getPullRequest,
} = require("../../../src/utils/gitHubUtil.js");

describe("Conflict status", function () {
	it("Should create a conflict", async () => {
		const content = `[flake8]
		max-line-length = 88 --- code from pull request ---`;

		const articleFiles = [
			{
				path: ".flake8",
				content: content,
				encoding: "utf-8",
			},
		];
		const contributor_name = await getGithubContributor();
		const gitHubRepoFullName = `${contributor_name}/demo`;
		const commitTitle = "Add conflicting code";
		const gitHubRepoBranchName = "conflictTest";

        const commit = await createGitHubCommit(
            gitHubRepoFullName,
            gitHubRepoBranchName,
            commitTitle,
            articleFiles
        );
			// const createPR = await createPullRequest(
			// 	contributor_name,
			// 	"demo",
			// 	"generateConflict",
			// 	99,
			// 	"generate a merge conflict for testing"
			// );
			// await mergePullRequest(owner, repo, defaultHash)
			// console.log("createPR", createPR);
			// const pr = await getPullRequest(contributor_name, "demo", 99)
			// console.log('new PR =>', pr)

			console.log("commit ->", commit);

		assert.equal(createConflict.status, 201, "Fail to create PR.");

		/*
			- A new PR is created
            - A commit is created and pushed to that new PR
			- It alters flake8 throwing PR#7 into conflict
			- Tests should see that this PR#7 now has a state of conflict
            - Voting should not be possible
			- A new commit is pushed to PR#7 which resolves the conflict, it is created in GH service and engine
			- This is created in GH service and engine, the PR now has a state of pre-open
			- The tests continue as before, with new child/DefaultHashes
			- Vote totals for the old commit should be recorded
			- Vote totals for most recent commit should be recorded
			*/
	});
});
