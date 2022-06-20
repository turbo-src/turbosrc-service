const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetContributorName,
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
    const user = await getGithubUser()
    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ user,
        /*amount:*/ 33_999,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "am",
        /*amount:*/ 15_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "jc",
        /*amount:*/ 10_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "pc",
        /*amount:*/ 75_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "mb",
        /*amount:*/ 75_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "np",
        /*amount:*/ 5_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "nn",
        /*amount:*/ 100_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "jp",
        /*amount:*/ 50_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "ts",
        /*amount:*/ 50_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "af",
        /*amount:*/ 10_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "ds",
        /*amount:*/ 75_000,
    );

    this.timeout(snooze_ms);
    await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*from:*/ "mary",
        /*to:*/ "ri",
        /*amount:*/ 1_000,
    );

    const maryContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "mary",
        /*side:*/ "no",
    );

    const maryContributorTokenAmount = Number(maryContributorTokenAmountRes)

    const contributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ user,
        /*side:*/ "no",
    );

    const contributorTokenAmount = Number(contributorTokenAmountRes)

    const amContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "am",
        /*side:*/ "no",
    );

    const amContributorTokenAmount = Number(amContributorTokenAmountRes)

    const jcContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "jc",
        /*side:*/ "no",
    );

    const jcContributorTokenAmount = Number(jcContributorTokenAmountRes)

    const pcContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "pc",
        /*side:*/ "no",
    );

    const pcContributorTokenAmount = Number(pcContributorTokenAmountRes)

    const mbContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "mb",
        /*side:*/ "no",
    );

    const mbContributorTokenAmount = Number(mbContributorTokenAmountRes)

    const npContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "np",
        /*side:*/ "no",
    );

    const npContributorTokenAmount = Number(npContributorTokenAmountRes)

    const nnContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "nn",
        /*side:*/ "no",
    );

    const nnContributorTokenAmount = Number(nnContributorTokenAmountRes)

    const jpContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "jp",
        /*side:*/ "no",
    );

    const jpContributorTokenAmount = Number(jpContributorTokenAmountRes)

    const tsContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "ts",
        /*side:*/ "no",
    );

    const tsContributorTokenAmount = Number(tsContributorTokenAmountRes)

    const afContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "af",
        /*side:*/ "no",
    );

    const afContributorTokenAmount = Number(afContributorTokenAmountRes)

    const dsContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "ds",
        /*side:*/ "no",
    );

    const dsContributorTokenAmount = Number(dsContributorTokenAmountRes)

    const riContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "ri",
        /*side:*/ "no",
    );

    const riContributorTokenAmount = Number(riContributorTokenAmountRes)

    assert.equal(
        contributorTokenAmount,
        33_999,
        "Fail to get amount."
    );

    assert.equal(
        amContributorTokenAmount,
        15_000,
        "Fail to get amount."
    );

    assert.equal(
        jcContributorTokenAmount,
        10_000,
        "Fail to get amount."
    );

    assert.equal(
        pcContributorTokenAmount,
        75_000,
        "Fail to get amount."
    );

    assert.equal(
        mbContributorTokenAmount,
        75_000,
        "Fail to get amount."
    );

    assert.equal(
        npContributorTokenAmount,
        5_000,
        "Fail to get amount."
    );

    assert.equal(
        nnContributorTokenAmount,
        100_000,
        "Fail to get amount."
    );

    assert.equal(
        jpContributorTokenAmount,
        50_000,
        "Fail to get amount."
    );

    assert.equal(
        tsContributorTokenAmount,
        50_000,
        "Fail to get amount."
    );

    assert.equal(
        afContributorTokenAmount,
        10_000,
        "Fail to get amount."
    );

    assert.equal(
        dsContributorTokenAmount,
        75_000,
        "Fail to get amount."
    );

    assert.equal(
        riContributorTokenAmount,
        1_000,
        "Fail to get amount."
    );

    assert.equal(
        maryContributorTokenAmount,
        500_001,
        "Fail to get amount."
    );

    const maryName = await postGetContributorName(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "mary",
    );
    this.timeout(snooze_ms*50);
    const userName = await postGetContributorName(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ user,
    );

    assert.equal(
        maryName,
        "mary",
        "Fail to get contributors's name from namspace db by contributor id."
    );
    assert.equal(
        userName,
        user,
        "Fail to get contributors's signature from namspace db by contibutor id."
    );
  });
});