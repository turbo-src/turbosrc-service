const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetContributorTokenAmount,
        postCreateRepo,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 5000

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

describe('Create repo', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('Create repo', function () {
      it("Should do create repo", async () => {
        const contributor_name = await getGithubContributor()
        const contributor_id = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_4",
            /*contributor_name:*/ contributor_name,
        );
        await snooze(snooze_ms);
        await postCreateRepo(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "",
            /*contributor:*/ contributor_id,
            /*side:*/ "",
        );

        await snooze(snooze_ms);
        const contributorTokenAmountRes = await postGetContributorTokenAmount(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_4",
            /*contributor:*/ contributor_id,
            /*side:*/ "no",
        );

        const contributorTokenAmount = Number(contributorTokenAmountRes)

        assert.equal(
            contributorTokenAmount,
            1_000_000,
            "Fail to get amount."
        );
      });
    });
})