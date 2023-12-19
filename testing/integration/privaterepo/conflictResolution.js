const assert = require("assert");
const {
    getNameSpaceRepo,
    postGetRepoData,
    postGetContributorID,
    postGetVotes,
    postGetPullRequest,
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

        //const resolvedConflict = await postGetVotes(repoID, issueID, contributorID);

        const mergeStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ contributor_id,
            /*side:*/ "yes",
        );
        socket.disconnect()

        assert.deepEqual(
          mergeStatus,
         { status: 200, state: "pre-open", repo_id: repoID,  fork_branch: "pullRequest6", "mergeableCodeHost": true, "childDefaultHash": "f69d18f0fde201d83ce5de571168d7649aabc940", "defaultHash": "f69d18f0fde201d83ce5de571168d7649aabc940" },
          "Fail open on initial vote below quorum"
        );

        //assert.equal(
        //    resolvedConflict.state,
        //    "vote",
        //    "Failed to get pull request 6's state of 'vote'"
        //);

    });
});