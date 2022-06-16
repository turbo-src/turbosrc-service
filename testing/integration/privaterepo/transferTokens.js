const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetContributorTokenAmount,
        postTransferTokens
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

async function readDBfile(file) {
    const data = await fsPromises.readFile(file)
                       .catch((err) => console.error('Failed to read file', err));

    return data
}

var snooze_ms = 1500;;

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

describe.only('Check that transfer tokens reflected in database', function () {
before(async () => {
});
  it("Should transfer tokens", async () => {
    const user  = await getGithubUser();

    this.timeout(snooze_ms*50);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ user,
        /*amount:*/ 100000,
    );

    this.timeout(snooze_ms*50);
    const fromContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "mary",
        /*side:*/ "no",
    );

    this.timeout(snooze_ms*50);
    const toContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ user,
        /*side:*/ "no",
    );

    const fromContributorTokenAmount = Number(fromContributorTokenAmountRes)
    const toContributorTokenAmount = Number(toContributorTokenAmountRes)


    assert.equal(
        fromContributorTokenAmount,
        400001,
        "Fail to get token amount from sender."
    );
    assert.equal(
        toContributorTokenAmount,
        133999,
        "Fail to get token amount from receiver."
    );
  });
});