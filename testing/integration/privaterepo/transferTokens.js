const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetContributorTokenAmount,
        postTransferTokens,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../src/utils/config')
const {
       getGithubToken,
      } = require('../../../src/utils/gitHubUtil.js')

async function readDBfile(file) {
    const data = await fsPromises.readFile(file)
                       .catch((err) => console.error('Failed to read file', err));

    return data
}

var snooze_ms = 200;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe.only('Check that transfer tokens reflected in database', function () {
    this.timeout(snooze_ms*50);
before(async () => {
});
  it("Should transfer tokens", async () => {
    const contributor_name = await getGithubContributor()
    const token = await getGithubToken()
    const contributor_id = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ contributor_name,
    );
    console.log("contributor id: " + contributor_id)
    const testerTokenA = await getGithubToken("a")
    const yuhhID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "yuhh-h",
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ yuhhID,
        /*amount:*/ 500_001,
        /*token:*/ testerTokenA
    );
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0x571BD871120767344b4EE3Ec309c74a3D98aAf0B",
    //    /*amount:*/ 15_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0x493D1c854301054e5D0b0bCFE3cfAe893d573dBa",
    //    /*amount:*/ 10_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0x5061EF86EFcF6Ad2fdcefF8FE9E014a1Ca6801c2",
    //    /*amount:*/ 75_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0x232b9E710e897aEb18FEbe410526B987641BaE5f",
    //    /*amount:*/ 75_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0x55f8B1594beB8eA1fD366c0C138B26e70C03a6ec",
    //    /*amount:*/ 5_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0x45dD192B318e2f1d242954E016492BDF9446381e",
    //    /*amount:*/ 100_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0x1d344C9A2Ee5c0a24336dd1A0c5c79ccD50D06C9",
    //    /*amount:*/ 50_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0xd30Dcb56A4d3EC2dC8591588455A5Da4C3c84eCD",
    //    /*amount:*/ 10_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0x9095B61290249584d9d0447657a03Cf23BF7a325",
    //    /*amount:*/ 50_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0x1d0798e209A07715765F1486CA64f3D2399aF719",
    //    /*amount:*/ 75_000,
    //    /*token:*/ token
    //);
    //await postTransferTokens(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*from:*/ contributor_id,
    //    /*to:*/ "0xDB7A25D3B4C5506779bD9f9f1A5AA0DB525Fa6A8",
    //    /*amount:*/ 999,
    //    /*token:*/ token
    //);

    // Give offchain service a chance to write transfer amounts.
    // Transfer requests perhaps are in buffer.
    await snooze(snooze_ms*5);

    const yuhhContributorToken = await postGetContributorTokenAmount(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor:*/ "yuhhhF0Ef5F737ccD11B439D52E4c4be5ed8Cd7Ca8E",
        /*side:*/ "no",
        /*token:*/ testerTokenA
	
    );

    const contributorToken = await postGetContributorTokenAmount(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor:*/ contributor_id,
        /*side:*/ "no",
        /*token:*/ token
    );

    //const amContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0x571BD871120767344b4EE3Ec309c74a3D98aAf0B",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const jcContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0x493D1c854301054e5D0b0bCFE3cfAe893d573dBa",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const pcContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0x5061EF86EFcF6Ad2fdcefF8FE9E014a1Ca6801c2",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const mbContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0x232b9E710e897aEb18FEbe410526B987641BaE5f",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const npContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0x55f8B1594beB8eA1fD366c0C138B26e70C03a6ec",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const nnContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0x45dD192B318e2f1d242954E016492BDF9446381e",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const jpContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0x1d344C9A2Ee5c0a24336dd1A0c5c79ccD50D06C9",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const tsContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0x9095B61290249584d9d0447657a03Cf23BF7a325",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const afContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0xd30Dcb56A4d3EC2dC8591588455A5Da4C3c84eCD",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const dsContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0x1d0798e209A07715765F1486CA64f3D2399aF719",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //const riContributorToken = await postGetContributorTokenAmount(
    //    /*owner:*/ contributor_name,
    //    /*repo:*/ "demo",
    //    /*defaultHash:*/ "defaultHash4",
    //    /*contributor:*/ "0xDB7A25D3B4C5506779bD9f9f1A5AA0DB525Fa6A8",
    //    /*side:*/ "no",
    //    /*token:*/ token
    //);

    //assert.deepEqual(
    //    contributorToken,
    //    { status: 200, amount: 34_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    amContributorToken,
    //    { status: 200, amount: 15_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    jcContributorToken,
    //    { status: 200, amount: 10_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    pcContributorToken,
    //    { status: 200, amount: 75_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    mbContributorToken,
    //    { status: 200, amount: 75_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    npContributorToken,
    //    { status: 200, amount: 5_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    nnContributorToken,
    //    { status: 200, amount: 100_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    jpContributorToken,
    //    { status: 200, amount: 50_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    tsContributorToken,
    //    { status: 200, amount: 50_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    afContributorToken,
    //    { status: 200, amount: 10_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    dsContributorToken,
    //    { status: 200, amount: 75_000 },
    //    "Fail to get amount."
    //);

    //assert.deepEqual(
    //    riContributorToken,
    //    { status: 200, amount: 999 },
    //    "Fail to get amount."
    //);

    assert.deepEqual(
        yuhhContributorToken,
	{ status: 200, amount: 500_001 },
        "Fail to get amount."
    );

    const yuhhName = await postGetContributorName(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor:*/ "yuhhhF0Ef5F737ccD11B439D52E4c4be5ed8Cd7Ca8E"
    );

    assert.equal(
        yuhhName,
        "yuhh-h",
        "Fail to get contributors's name from namspace db by contributor id."
    );
  });
});
