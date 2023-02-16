const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
        postGetPullRequest,
        postGetPRvoteTotals,
        postGetPRvoteYesTotals,
        postCreateRepo,
        postNewPullRequest,
        postGetContributorID,
        postGetContributorName,
        postGetContributorTokenAmount,
        postTransferTokens
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../src/utils/config')
const {
       getGithubToken,
      } = require('../../../src/utils/gitHubUtil.js')


var snooze_ms = 1500;;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote.', function () {
    this.timeout(snooze_ms*70);
    // Increase mocha(testing framework) time, otherwise tests fails
    describe('Many voters vote.', function () {
      it("Should increment vote and then close and merge on quorum.", async () => {
        const contributor_name = await getGithubContributor()
        await snooze(snooze_ms);
        const contributor_id = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_name:*/ contributor_name,
        );

    // The main person in .config spinnning up turbosrc
	const token = await getGithubToken()

    const testerTokenA = await getGithubToken("a")
	const testerTokenB = await getGithubToken("b")
	const testerTokenC = await getGithubToken("c")
	const testerTokenD = await getGithubToken("d")
	const testerTokenE = await getGithubToken("e")
	const testerTokenF = await getGithubToken("f")
	const testerTokenG = await getGithubToken("g")
	const testerTokenH = await getGithubToken("h")
	const testerTokenI = await getGithubToken("i")
	const testerTokenJ = await getGithubToken("j")
	const testerTokenK = await getGithubToken("k")
	const testerTokenL = await getGithubToken("l")

    const tsrctester1ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_5",
        /*contributor_id:*/ "tsrctester1",
    );
    const tsrctester2ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_5",
        /*contributor_id:*/ "tsrctester2",
    );
    const tsrctester3ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_5",
        /*contributor_id:*/ "tsrctester3",
    );
    const tsrctester4ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_5",
        /*contributor_id:*/ "tsrctester4",
    );
    const tsrctester5ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_5",
        /*contributor_id:*/ "tsrctester5",
    );
    const tsrctester6ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_4",
        /*contributor_id:*/ "tester6tsrc",
    );
    const tsrctester7ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_4",
        /*contributor_id:*/ "tester7tsrc",
    );
    const tsrctester8ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_4",
        /*contributor_id:*/ "tester8tsrc",
    );
    const tsrctester9ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_4",
        /*contributor_id:*/ "tester9tsrc",
    );
    const tsrctester10ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_4",
        /*contributor_id:*/ "tester10tsrc",
    );
    const tsrctester11ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_4",
        /*contributor_id:*/ "tester11tsrc",
    );
    const tsrctester12ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "issue_4",
        /*contributor_id:*/ "tester12tsrc",
    );
        //jc
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0xafC193df9bB3d6d6062029b3E67243C00C17d534",
            /*side:*/ "no",
            /*token:*/ testerTokenB
        );
        await snooze(snooze_ms);
        const jcVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester2ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        // pc
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x695e603Ce6eE04095D59397871e81A3Af105CA50",
            /*side:*/ "yes",
            /*token:*/ testerTokenC
        );

        await snooze(snooze_ms);
        const pcVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester3ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        //mb
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x96fBb54D303309E5b901B0B1eAD598437762C543",
            /*side:*/ "yes",
            /*token:*/ testerTokenD
        );
        await snooze(snooze_ms);
        const mbVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester4ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        // np
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x0bfc3B651cC7b708f2F680C7A6ef339164d92b4e",
            /*side:*/ "yes",
            /*token:*/ testerTokenE
        );
        await snooze(snooze_ms);
        const npVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester5ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        // nn
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x28A9Bc213FE9D13533Bef161fA335cea929faA2c",
            /*side:*/ "yes",
            /*token:*/ testerTokenF
        );
        await snooze(snooze_ms);
        const nnVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester6ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        // jp
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x691F5015fc0e08BE75e0c0cbA32e584B9Ff095Bc",
            /*side:*/ "yes",
            /*token:*/ testerTokenG
        );
        await snooze(snooze_ms);
        const jpVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester7ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        // ts
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x4b9455F77652bc3Bf497D91e1b42790D99bbBfE8",
            /*side:*/ "yes",
            /*token:*/ testerTokenH
        );
        await snooze(snooze_ms);
        const tsVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester8ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        // af
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0xA6aADF3EAbf72A6FFb98a82547cAa67566724e31",
            /*side:*/ "no",
            /*token:*/ testerTokenI
        );
        await snooze(snooze_ms);
        const afVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester9ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        // ds
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x82438B428dE8A93Eb7405FAB7c0D2401fbC59c29",
            /*side:*/ "no",
            /*token:*/ testerTokenJ
        );
        await snooze(snooze_ms);
        const dsVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester10ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        // ri
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x21eAA0fB258F83a7D481498c971dC03930d26c15",
            /*side:*/ "no",
            /*token:*/ testerTokenK
        );
        await snooze(snooze_ms);
        const riVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester11ID,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        // tester 12/L
        await postSetVote(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*childDefaultHash:*/ "issue_5",
	    /*mergeable:*/ true,
            /*contributor_id:*/ "0x79b7Bf5717F93db6869baf6ddBf71d84728061F0",
            /*side:*/ "no",
            /*token:*/ testerTokenL
        );
        await snooze(snooze_ms);
        const tester12tsrcVoteCumm = await postGetPRvoteTotals(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester12ID,
            /*side:*/ "yes",
        );

        //assert.equal(
        //    amVoteCumm =
        //    "0.snooze_ms0",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    jcVoteCumm =
        //    "0.10000",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    pcVoteCumm =
        //    "0.75000",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    mbVoteCumm =
        //    "0.5000",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    npVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    nnVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    jpVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    tsVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    afVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        //assert.equal(
        //    dsVoteCumm =
        //    "0.499999",
        //    "Fail to add votes."
        //);
        // Transfer closing vote power to manual vote close.
        await snooze(snooze_ms);

        await postTransferTokens(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*from:*/ tsrctester1ID,
            /*to:*/ contributor_id,
            /*amount:*/ 499_999,
            /*token:*/ testerTokenA
        );
        await snooze(snooze_ms);
        const mergeStatus = await postGetPullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "issue_5",
            /*contributor_id:*/ tsrctester11ID,
            /*side:*/ "yes",
        );

        await snooze(snooze_ms);

        assert.equal(
            tester12tsrcVoteCumm,
            "0.465999",
            "Fail to add votes."
        );
        assert.deepEqual(
          mergeStatus,
         { status: 200, state: "open", repo_id: `${contributor_name}/demo`,  fork_branch: "pullRequest5", "mergeableCodeHost": true, "childDefaultHash": "3baa5aec09d458cd1cd935ab144ef7f68462cd71", "defaultHash": "3baa5aec09d458cd1cd935ab144ef7f68462cd71" },
          "Fail to open even though it was voted beyond pre-open."
        );
      });
    });
});