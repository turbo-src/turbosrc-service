const assert = require("assert");
const fsPromises = require("fs").promises;
const {
	postSetVote,
	postGetPullRequest,
	postGetPRvoteYesTotals,
	postGetPRvoteNoTotals,
	postGetPRvoteTotals,
	postCreateRepo,
	postNewPullRequest,
	postGetContributorID,
	postGetContributorName,
	getNameSpaceRepo,
} = require("../../../src/utils/requests");
const { Parser } = require("graphql/language/parser");
const {
	getContributorAddress,
	getGithubContributor,
} = require("../../../src/utils/config");
const { getGithubToken } = require("../../../src/utils/gitHubUtil.js");
const { socket } = require("../../../socketConfig");
var snooze_ms = 3000;
const content = require('./conflict.js')

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Voting.", function () {
	this.timeout(snooze_ms * 12);
	// Increase mocha(testing framework) time, otherwise tests fails
	before(async () => {});
	describe("Two voters vote - exceed quorum.", function () {
		it("Should close open and close vote, then merge.", async () => {
			const contributor_name = await getGithubContributor();
			const token = await getGithubToken();
			await snooze(snooze_ms);
			const contributor_id = await postGetContributorID(
				/*owner:*/ contributor_name,
				/*repo:*/ "demo",
				/*defaultHash:*/ "issue_1",
				/*contributor_name:*/ contributor_name
			);

			const { repoID } = await getNameSpaceRepo(`${contributor_name}/demo`);

			await snooze(snooze_ms);
			//user
			const voteRes = await postSetVote(
				/*owner:*/ contributor_name,
				/*repo:*/ repoID,
				/*defaultHash:*/ "issue_1",
				/*childDefaultHash:*/ "issue_1",
				/*mergeable:*/ true,
				/*contributor:*/ contributor_id,
				/*side:*/ "yes",
				/*token:*/ token
			);
			socket.emit("vote cast", contributor_name, repoID, "issue_1");
			await snooze(snooze_ms);
			const voteYesTotals = await postGetPRvoteYesTotals(
				/*owner:*/ contributor_name,
				/*repo:*/ repoID,
				/*defaultHash:*/ "issue_1",
				/*contributor:*/ contributor_id,
				/*side:*/ "yes"
			);
			await snooze(snooze_ms);
			const voteNoTotals = await postGetPRvoteNoTotals(
				/*owner:*/ contributor_name,
				/*repo:*/ repoID,
				/*defaultHash:*/ "issue_1",
				/*contributor:*/ contributor_id,
				/*side:*/ "yes"
			);
			const voteTotals = await postGetPRvoteTotals(
				/*owner:*/ contributor_name,
				/*repo:*/ repoID,
				/*defaultHash:*/ "issue_1",
				/*contributor:*/ contributor_id,
				/*side:*/ "yes"
			);
			await snooze(snooze_ms);
			const openStatus = await postGetPullRequest(
				/*owner:*/ contributor_name,
				/*repo:*/ repoID,
				/*defaultHash:*/ "issue_1",
				/*contributor:*/ contributor_id,
				/*side:*/ "yes"
			);
			await snooze(snooze_ms);

			const testerTokenA = await getGithubToken("a");
			const tsrctester1ID = await postGetContributorID(
				/*owner:*/ contributor_name,
				/*repo:*/ "demo",
				/*defaultHash:*/ "issue_1",
				/*contributor:*/ "tsrctester1"
			);
			
			/*
			1. A new commit is merged to master:
			 - It alters lsp.lua throwing the current Pr into conflict
			2. Tests should see that this pr now has a state of conflict
			3. A new commit is created which resolves the conflict, it is created in GH service and engine
			4. Voting should not be possible
			5. This is created in GH service and engine, the PR now has a state of pre-open
			6. The tests continue as before, with new child/DefaultHashes
			7. Vote totals for the old commit should be recorded
			8. Vote totals for most recent commit should be recorded
			*/
			
			const content = `[flake8]
			max-line-length = 88 *`

			const articleFiles = [
				{
				  path: "/demo/.flake8",
				  content: content,
				  encoding: "utf-8",
				},
			  ];
		  
		  await createGithubCommit(
			githubAccessToken,
			githubRepoFullName,
			githubRepoBranchName,
			commitTitle,
			articleFiles
		  );

			//tsrctester1
			await postSetVote(
				/*owner:*/ contributor_name,
				/*repo:*/ repoID,
				/*defaultHash:*/ "issue_1",
				/*childDefaultHash:*/ "issue_1",
				/*mergeable:*/ true,
				/*contributor_id:*/ tsrctester1ID,
				/*side:*/ "yes",
				/*token:*/ testerTokenA
			);
			socket.emit("vote cast", contributor_name, repoID, "issue_1");
			await snooze(snooze_ms);
			const mergeStatus = await postGetPullRequest(
				/*owner:*/ contributor_name,
				/*repo:*/ repoID,
				/*defaultHash:*/ "issue_1",
				/*contributor_id:*/ tsrctester1ID,
				/*side:*/ "yes"
			);

			const voteTotalsFinal = await postGetPRvoteTotals(
				/*owner:*/ contributor_name,
				/*repo:*/ repoID,
				/*defaultHash:*/ "issue_1",
				/*contributor:*/ contributor_id,
				/*side:*/ "yes"
			);

			//console.log(status)
			socket.disconnect();
			assert.equal(voteRes, 201, "Fail to vote.");
			assert.equal(voteYesTotals, "34000", "Fail to add votes yes.");
			assert.equal(voteNoTotals, "0", "Fail to add votes no.");
			assert.equal(voteTotals, "0.034", "Fail to add votes no.");
			assert.deepEqual(
				openStatus,
				{
					status: 200,
					state: "pre-open",
					repo_id: repoID,
					fork_branch: "pullRequest1",
					mergeableCodeHost: true,
					childDefaultHash: "dcdaa43d22e488b99ff1b0a86255540ce0449cd7",
					defaultHash: "dcdaa43d22e488b99ff1b0a86255540ce0449cd7",
				},
				"Fail to stay open."
			);
			assert.equal(voteTotalsFinal, "0.534001", "Fail to tally all votes.");

			assert.deepEqual(
				mergeStatus,
				{
					status: 200,
					state: "merge",
					repo_id: repoID,
					fork_branch: "pullRequest1",
					mergeableCodeHost: true,
					childDefaultHash: "dcdaa43d22e488b99ff1b0a86255540ce0449cd7",
					defaultHash: "dcdaa43d22e488b99ff1b0a86255540ce0449cd7",
				},
				"Fail to merge even though it was voted in."
			);
		});
	});
});
