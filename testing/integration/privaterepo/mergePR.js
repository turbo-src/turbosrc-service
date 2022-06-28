const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
        postGetPRvoteStatus,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postCreateRepo,
        postNewPullRequest,
        postClosePullRequest,
        postMergePullRequest,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getGithubContributor() {
    const data = await fsPromises.readFile('.config.json')
                       .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let user = json.github.user
    if (user === undefined) {
      throw new Error("Failed to load Github user " + user);

    } else {
      console.log("Successfully read Github " + user);
    }

    return user

}

describe('Pull requests', function () {
    this.timeout(15000);
    // Increase mocha(testing framework) time, otherwise tests fails
    //before(async () => {
    //    await postCreateRepo(
    //        /*owner:*/ "vim",
    //        /*repo:*/ "vim",
    //        /*pr_id:*/ "issue_4955",
    //        /*contributor:*/ contributor_name,
    //        /*side:*/ "yes",
    //    );
    //});
    describe.only('Merge pull request.', function () {
      it("Should merge pull request.", async () => {
        const contributor_name = await getGithubContributor()
        await snooze(1500);

        await postMergePullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_8",
            /*contributor:*/ contributor_name,
            /*side:*/ "yes",
        );
        assert.equal(
            true,
            false,
            "fail to merge pull request"
        );

        //assert.equal(
        //    statusDuplicatePR,
        //    "closed",
        //    "Duplicate pull request."
        //);

      });
    });
});