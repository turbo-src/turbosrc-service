const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateUser,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../src/utils/requests')

const { Parser } = require('graphql/language/parser');

const {
        getContributorAddress,
        getGithubContributor,
        getGithubToken,
      } = require('../../../src/utils/config')

var snooze_ms = 5000

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create users', function () {
    this.timeout(snooze_ms*24);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        //const userAddr = await getContributorAddress()

        //Gets it from .config.json

        const contributor_name = await getGithubContributor()
	const token = await getGithubToken()
        const contributor_id = await getContributorAddress()
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ contributor_id,
            /*contributor_name:*/ contributor_name,
            /*contributor_signature:*/ "ae41e400825a03c9cf1544d33bcffc35a0f4ae9884f1826b124acd9152bc262",
            /*token:*/ token
        );

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

        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x09D56A39599Dd81e213EB2A9Bd6785945B662662",
            /*contributor_name:*/ "tsrctester1",
            /*contributor_signature:*/ "e0c911adbce919ea366cdeb5015b18b0e7980e659c3a89cd962a29ff743370b8",
            /*token:*/ testerTokenA
        );

        // tester b
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0xafC193df9bB3d6d6062029b3E67243C00C17d534",
            /*contributor_name:*/ "tsrctester2",
            /*contributor_signature:*/ "257be612b5cb88dfe83a82d04ba8d7a79fadba81ea46c87ce33f51c5beeb6a34",
            /*token:*/ token,
            /*token:*/ testerTokenB
        );

        // tester c
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x695e603Ce6eE04095D59397871e81A3Af105CA50",
            /*contributor_name:*/ "tsrctester3",
            /*contributor_signature:*/ "ebe2e68c5c16503f237290e2f83faa77b913cd2b460f6acdf8e96fffe59b65b6",
            /*token:*/ testerTokenC
        );

        // tester d
         await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x96fBb54D303309E5b901B0B1eAD598437762C543",
            /*contributor_name:*/ "tsrctester4",
            /*contributor_signature:*/ "e50c4f3115d053fd65732af4dfd06ad9df0466a768fdaf72b57ebab9835833af",
            /*token:*/ testerTokenD
        );

        // tester e
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x0bfc3B651cC7b708f2F680C7A6ef339164d92b4e",
            /*contributor_name:*/ "tsrctester5",
            /*contributor_signature:*/ "6985a523cee22eb00c965c7d9253b500e37d660552e063932298c463cb4c4fdc",
            /*token:*/ testerTokenE
        );

        // tester f
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x28A9Bc213FE9D13533Bef161fA335cea929faA2c",
            /*contributor_name:*/ "tester6tsrc",
            /*contributor_signature:*/ "095677c14f375d75c7e6e10a89411bb80acf751fbaa53a11fbacc3ee9ae24f79",
            /*token:*/ testerTokenF
        );

        // tester g
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x691F5015fc0e08BE75e0c0cbA32e584B9Ff095Bc",
            /*contributor_name:*/ "tester7tsrc",
            /*contributor_signature:*/ "d93020658954c1171d5db19c5ec0abc66c041767120143072aafcef577490b21",
            /*token:*/ testerTokenG
        );

        // tester h
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x4b9455F77652bc3Bf497D91e1b42790D99bbBfE8",
            /*contributor_name:*/ "tester8tsrc",
            /*contributor_signature:*/ "5ba1efba1ec15013425bdfc3fc696e06f03e6f035425b13aa27ec1ca98ad2a18",
            /*token:*/ testerTokenH
        );

        // tester i
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0xA6aADF3EAbf72A6FFb98a82547cAa67566724e31",
            /*contributor_name:*/ "tester9tsrc",
            /*contributor_signature:*/ "8aef7b2e940826692068ef53d26178a30c35015faac2d5c5637fb7f839266b1c",
            /*token:*/ testerTokenI
        );

        // tester j
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x82438B428dE8A93Eb7405FAB7c0D2401fbC59c29",
            /*contributor_name:*/ "tester10tsrc",
            /*contributor_signature:*/ "0ee7910469516cd64658ca56394b193082185639c9bca3f0bc116a0deddc6ac2",
            /*token:*/ testerTokenJ
        );

        // tester k
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x21eAA0fB258F83a7D481498c971dC03930d26c15",
            /*contributor_name:*/ "tester11tsrc",
            /*contributor_signature:*/ "ee2e9b952cbadbe5276be4c458d070fcc4d52664a71c8c92665e5cd078e17580",
            /*token:*/ testerTokenK
        );

        // tester l
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "0x79b7Bf5717F93db6869baf6ddBf71d84728061F0",
            /*contributor_name:*/ "tester12tsrc",
            /*contributor_signature:*/ "55b8ca31d38a3ba656e28d4bba151504d6490f8c0ff2967aa0ef036bab155bf8",
            /*token:*/ testerTokenL
        );

    });
    describe.only('Get contributor name.', function () {
      it("Should do something", async () => {
        const contributor_name = await getGithubContributor()
        await snooze(snooze_ms);
        const contributor_id = await postGetContributorID(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash4",
            /*contributor_name:*/ contributor_name,
        );

        const tsrctester1Name = await postGetContributorName(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash4",
            /*contributor:*/ "0x09D56A39599Dd81e213EB2A9Bd6785945B662662",
        );

        const tsrctester12Name = await postGetContributorName(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash4",
            /*contributor:*/ "0x79b7Bf5717F93db6869baf6ddBf71d84728061F0",
        );

        const userName = await postGetContributorName(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*defaultHash:*/ "defaultHash4",
            /*contributor:*/ contributor_id,
        );

        assert.equal(
            tsrctester1Name,
            "tsrctester1",
            "Fail to get contributors's name from namspace db by contributor id."
        );
        // ...skiped 2 - 11, but should test eventually.
        assert.equal(
            tsrctester12Name,
            "tester12tsrc",
            "Fail to get tester 12/L contributors's name from namspace db by contributor id."
        );
        assert.equal(
            userName,
            contributor_name,
            "Fail to get contributors's signature from namspace db by contibutor id."
        );
      });
    });
});