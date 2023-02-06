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
      } = require('../../../src/utils/config')
const {
       getGithubToken,
      } = require('../../../src/utils/gitHubUtil.js')


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

        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0x493D1c854301054e5D0b0bCFE3cfAe893d573dBa",
        //    /*contributor_name:*/ "jc",
        //    /*contributor_signature:*/ "e3cf0768d0d2920892da66f44055241300e5b6d3d570207f0e89bc4b301c0911",
        //    /*token:*/ token
        //);

        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0x5061EF86EFcF6Ad2fdcefF8FE9E014a1Ca6801c2",
        //    /*contributor_name:*/ "pc",
        //    /*contributor_signature:*/ "d5a088816c5038814e1f344e3ff0b1585391e26dec3c595fa83c22da65bf5a2a",
        //    /*token:*/ token
        //);

        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0x232b9E710e897aEb18FEbe410526B987641BaE5f",
        //    /*contributor_name:*/ "mb",
        //    /*contributor_signature:*/ "0b0ad429c51453564c6ec1c9bdebe16e51d04794f88ad3b74927068cda4c894e",
        //    /*token:*/ token
        //);

        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0x55f8B1594beB8eA1fD366c0C138B26e70C03a6ec",
        //    /*contributor_name:*/ "np",
        //    /*contributor_signature:*/ "604f930b8e88787457a94abeb889eb2a363679637698b10d64929a3f34b815e4",
        //    /*token:*/ token
        //);

        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0x45dD192B318e2f1d242954E016492BDF9446381e",
        //    /*contributor_name:*/ "nn",
        //    /*contributor_signature:*/ "66acf24f1298e4eb0eb158b62fbd5d3cc1f467be79d427a0f336b15e4b7c99cf",
        //    /*token:*/ token
        //);

        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0x1d344C9A2Ee5c0a24336dd1A0c5c79ccD50D06C9",
        //    /*contributor_name:*/ "jp",
        //    /*contributor_signature:*/ "d5894454babd1a75f586b4db0a10b1160c0883c6c6a311d9595d560ff4a28e8d",
        //    /*token:*/ token
        //);

        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0xd30Dcb56A4d3EC2dC8591588455A5Da4C3c84eCD",
        //    /*contributor_name:*/ "af",
        //    /*contributor_signature:*/ "abceec1c1e8379a75bd76233bb7bd1887bf2b3a2713b9022110849938407cc31",
        //    /*token:*/ token
        //);
        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0x9095B61290249584d9d0447657a03Cf23BF7a325",
        //    /*contributor_name:*/ "ts",
        //    /*contributor_signature:*/ "10f7e287f50c2daac084a809b809b16bc88f68033fe91939978386d237054b55`",
        //    /*token:*/ token
        //);

        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0x1d0798e209A07715765F1486CA64f3D2399aF719",
        //    /*contributor_name:*/ "ds",
        //    /*contributor_signature:*/ "5039ae9ae169599d0b7d4c78bb80af3db4f1082bab2ee03c1fe33816d9f1a33a",
        //    /*token:*/ token
        //);

        //await postCreateUser(
        //    /*owner:*/ "",
        //    /*repo:*/ "",
        //    /*contributor_id:*/ "0xDB7A25D3B4C5506779bD9f9f1A5AA0DB525Fa6A8",
        //    /*contributor_name:*/ "ri",
        //    /*contributor_signature:*/ "52b687c3401542006d57fbb2de83815441b7bc6b032cd91cfbe1cff119ff30bc",
        //    /*token:*/ token
        //);

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
        assert.equal(
            userName,
            contributor_name,
            "Fail to get contributors's signature from namspace db by contibutor id."
        );
      });
    });
});
