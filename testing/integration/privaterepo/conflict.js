const assert = require("assert");
const {
    getNameSpaceRepo,
    postGetRepoData,
    postGetContributorID,
    postGetVotes,
    postGetPullRequest,
	postSetVote,
} = require("../../../src/utils/requests");
const { getGithubContributor } = require("../../../src/utils/config");
const { getGithubToken } = require("../../../src/utils/gitHubUtil.js");

var snooze_ms = 3000;
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
describe("Conflict", function () {
    this.timeout(snooze_ms*70);
    it("Should return a PR in 'conflict'", async () => {
		const token = await getGithubToken();
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

        // Creates a tsrc pull request.
        const pullRequest = await postGetVotes(repoID, issueID, contributorID);

        const beforeVoteMergeStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ contributorID,
            /*side:*/ "yes",
        );

		const voteRes = await postSetVote(
			/*owner:*/ contributor_name,
			/*repo:*/ repoID,
			/*defaultHash:*/ issueID,
			/*childDefaultHash:*/ issueID,
			/*mergeable:*/ true,
			/*contributor:*/ contributorID,
			/*side:*/ "yes",
			/*token:*/ token
		);

        const afterVoteMergeStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ contributorID,
            /*side:*/ "yes",
        );

        assert.equal(voteRes, '403', 'voted on conflicted pull request')

        assert.deepEqual(
          beforeVoteMergeStatus,
         { status: 200, state: "vote", repo_id: repoID,  fork_branch: "pullRequest6", "mergeableCodeHost": false, "childDefaultHash": "4534afa8b4ce247d2f538f98651e34d0ceb223e9", "defaultHash": "4534afa8b4ce247d2f538f98651e34d0ceb223e9" },
          "Fail to find out status of pull request."
        );

        assert.deepEqual(
          afterVoteMergeStatus,
         { status: 200, state: "vote", repo_id: repoID,  fork_branch: "pullRequest6", "mergeableCodeHost": false, "childDefaultHash": "4534afa8b4ce247d2f538f98651e34d0ceb223e9", "defaultHash": "4534afa8b4ce247d2f538f98651e34d0ceb223e9" },
          "Fail to find out status of pull request."
        );
    });
});