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
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tsrctester1",
    );
    const tsrctester2ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tsrctester2",
    );
    const tsrctester3ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tsrctester3",
    );
    const tsrctester4ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tsrctester4",
    );
    const tsrctester5ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tsrctester5",
    );
    const tsrctester6ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tester6tsrc",
    );
    const tsrctester7ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tester7tsrc",
    );
    const tsrctester8ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tester8tsrc",
    );
    const tsrctester9ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tester9tsrc",
    );
    const tsrctester10ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tester10tsrc",
    );
    const tsrctester11ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tester11tsrc",
    );
    const tsrctester12ID = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor_name:*/ "tester12tsrc",
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester1ID,
        /*amount:*/ 500_001,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester2ID,
        /*amount:*/ 15_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester3ID,
        /*amount:*/ 10_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester3ID,
        /*amount:*/ 75_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester4ID,
        /*amount:*/ 75_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester5ID,
        /*amount:*/ 5_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester6ID,
        /*amount:*/ 100_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester7ID,
        /*amount:*/ 50_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester8ID,
        /*amount:*/ 10_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester9ID,
        /*amount:*/ 50_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester10ID,
        /*amount:*/ 75_000,
        /*token:*/ token
    );
    await postTransferTokens(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*from:*/ contributor_id,
        /*to:*/ tsrctester11ID,
        /*amount:*/ 999,
        /*token:*/ token
    );

    // Give offchain service a chance to write transfer amounts.
    // Transfer requests perhaps are in buffer.
    await snooze(snooze_ms*5);

    const tsrctester1ContributorToken = await postGetContributorTokenAmount(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor:*/ tsrctester1ID,
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

    const kContributorToken = await postGetContributorTokenAmount(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor:*/ tsrctester11ID,
        /*side:*/ "no",
        /*token:*/ testerTokenK
    );

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

    assert.deepEqual(
        kContributorToken,
        { status: 200, amount: 999 },
        "Fail to get amount."
    );

    assert.deepEqual(
        tsrctester1ContributorToken,
	{ status: 200, amount: 500_001 },
        "Fail to get amount."
    );

    const tsrctester1Name = await postGetContributorName(
        /*owner:*/ contributor_name,
        /*repo:*/ "demo",
        /*defaultHash:*/ "defaultHash4",
        /*contributor:*/ "0x09D56A39599Dd81e213EB2A9Bd6785945B662662"
    );

    assert.equal(
        tsrctester1Name,
        "tsrctester1",
        "Fail to get contributors's name from namspace db by contributor id."
    );
  });
});
