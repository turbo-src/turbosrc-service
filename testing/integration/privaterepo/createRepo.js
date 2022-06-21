const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetContributorTokenAmount,
        postCreateRepo,
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 5000

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getGithubUser() {
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
        const user  = await getGithubUser();
        await snooze(snooze_ms);
        await postCreateRepo(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "",
            /*contributor:*/ "0x09EAF54C0fc9F2b077ebC96e3FeD47051f7fb626",
            /*side:*/ "",
        );

        const maryContributorTokenAmountRes = await postGetContributorTokenAmount(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_4",
            /*contributor:*/ "0x09EAF54C0fc9F2b077ebC96e3FeD47051f7fb626",
            /*side:*/ "no",
        );

        const maryContributorTokenAmount = Number(maryContributorTokenAmountRes)

        assert.equal(
            maryContributorTokenAmount,
            1_000_000,
            "Fail to get amount."
        );
      });
    });
})