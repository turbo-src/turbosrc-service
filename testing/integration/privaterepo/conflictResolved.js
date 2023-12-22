const assert = require("assert");
const {
    getNameSpaceRepo,
    postGetRepoData,
    postGetContributorID,
    postGetVotes,
    postGetPullRequest,
    postSetVote,
   postGetPRvoteTotals,
} = require("../../../src/utils/requests");
const { getGithubContributor } = require("../../../src/utils/config");
const { getGithubToken } = require("../../../src/utils/gitHubUtil.js");

var snooze_ms = 3000;
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
describe("Conflict", function () {
    this.timeout(snooze_ms * 70);
    it("Should return a PR in 'conflict'", async () => {
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
        // The main person in .config spinnning up turbosrc
	    const token = await getGithubToken()

        const testerTokenA = await getGithubToken("a")
	const testerTokenB = await getGithubToken("b")
        const testerTokenC = await getGithubToken("c")

        const tsrctester1ID = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ 'tsrctester1',
        );
        const tsrctester2ID = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ 'tsrctester2',
        );

        const tsrctester3ID = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ 'tsrctester3',
        );
        // Creates a tsrc pull request.
        const pullRequest = await postGetVotes(repoID, issueID, contributorID);

        const beforeVoteStats = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ contributorID,
            /*side:*/ "yes",
        );

        const firstVoteRes = await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*childDefaultHash:*/ issueID,
	        /*mergeable:*/ true,
            /*contributor_id:*/ tsrctester1ID,
            /*side:*/ "yes",
            /*token:*/ testerTokenA
        );

        await snooze(snooze_ms);

        const voteStatsAfterFirstVote = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ contributorID,
            /*side:*/ "yes",
        );

        const firstVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor:*/ contributorID,
            /*side:*/ "no",
        );

        const secondVoteRes = await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*childDefaultHash:*/ issueID,
	        /*mergeable:*/ true,
            /*contributor_id:*/ tsrctester2ID,
            /*side:*/ "yes",
            /*token:*/ testerTokenB
        );

        await snooze(snooze_ms);

        const voteStatsAfterSecondVote = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ contributorID,
            /*side:*/ "yes",
        );

        const secondVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor:*/ contributorID,
            /*side:*/ "no",
        );

        await snooze(snooze_ms);

        const thirdVoteRes = await postSetVote(
	    /*owner:*/ contributor_name,
	    /*repo:*/ repoID,
	    /*defaultHash:*/ issueID,
	    /*childDefaultHash:*/ issueID,
	    /*mergeable:*/ true,
	    /*contributor:*/ tsrctester3ID,
	    /*side:*/ "yes",
	    /*token:*/ testerTokenC
        );

        const voteStatsAfterThirdVote = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor_id:*/ contributorID,
            /*side:*/ "yes",
        );

        const thirdVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ repoID,
            /*defaultHash:*/ issueID,
            /*contributor:*/ contributorID,
            /*side:*/ "no",
        );

        console.log(firstVoteRes, '201', 'unable to vote in mergeable')
        console.log(secondVoteRes, '201', 'unable to vote in mergeable')
        console.log(thirdVoteRes, '201', 'unable to vote in mergeable')

        console.log('beforeVoteStats', beforeVoteStats)

        console.log('voteStatsAfterFirstVote', voteStatsAfterFirstVote)
        console.log('firstVoteCumm', firstVoteCumm)
        console.log('voteStatsAfterSecondVote', voteStatsAfterSecondVote)
        console.log('secondVoteCumm', secondVoteCumm)
        console.log('voteStatsAfterThirdVote', voteStatsAfterThirdVote)
        console.log('thirdVoteCumm', thirdVoteCumm)

        //assert.deepEqual(
        //    beforeVoteMergeStatus,
        //    { status: 200, state: "vote", repo_id: repoID, fork_branch: "pullRequest6", "mergeableCodeHost": true, "childDefaultHash": "b22871b5c66fed0b8969453151e93f40d014434c", "defaultHash": "4534afa8b4ce247d2f538f98651e34d0ceb223e9" },
        //    "Fail to find out status of pull request."
        //);

        //assert.deepEqual(
        //    voteStatsAfterFirstVote,
        //    { status: 200, state: "vote", repo_id: repoID, fork_branch: "pullRequest6", "mergeableCodeHost": true, "childDefaultHash": "b22871b5c66fed0b8969453151e93f40d014434c", "defaultHash": "4534afa8b4ce247d2f538f98651e34d0ceb223e9" },
        //    "Fail to find out status of pull request."
        //);
        //assert.deepEqual(
        //    voteStatsAfterSecondVote,
        //    { status: 200, state: "vote", repo_id: repoID, fork_branch: "pullRequest6", "mergeableCodeHost": true, "childDefaultHash": "b22871b5c66fed0b8969453151e93f40d014434c", "defaultHash": "4534afa8b4ce247d2f538f98651e34d0ceb223e9" },
        //    "Fail to find out status of pull request."
        //);
        //assert.deepEqual(
        //    voteStatsAfterThirdVote,
        //    { status: 200, state: "vote", repo_id: repoID, fork_branch: "pullRequest6", "mergeableCodeHost": true, "childDefaultHash": "b22871b5c66fed0b8969453151e93f40d014434c", "defaultHash": "4534afa8b4ce247d2f538f98651e34d0ceb223e9" },
        //    "Fail to find out status of pull request."
        //);
    });
});
