const assert = require('assert');
const {
        postCreateUser,
        postGetContributorName,
      } = require('../../../graphQLrequests')

const {
        getContributorAddress,
        getGithubUser,
      } = require('../../../utils')

const { Parser } = require('graphql/language/parser');

var snooze_ms = 5000

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create repo', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
        const user = await getGithubUser()
        //const userAddr = await getContributorAddress()

        //Gets it from .config.json
        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ user,
            /*contributor_name:*/ user,
            /*contributor_signature:*/ "456",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "mary",
            /*contributor_name:*/ "mary",
            /*contributor_signature:*/ "1",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "am",
            /*contributor_name:*/ "am",
            /*contributor_signature:*/ "2",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "jc",
            /*contributor_name:*/ "jc",
            /*contributor_signature:*/ "3",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "pc",
            /*contributor_name:*/ "pc",
            /*contributor_signature:*/ "4",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "mb",
            /*contributor_name:*/ "mb",
            /*contributor_signature:*/ "5",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "np",
            /*contributor_name:*/ "np",
            /*contributor_signature:*/ "6",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "nn",
            /*contributor_name:*/ "nn",
            /*contributor_signature:*/ "7",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "jp",
            /*contributor_name:*/ "jp",
            /*contributor_signature:*/ "8",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "af",
            /*contributor_name:*/ "af",
            /*contributor_signature:*/ "9",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "ds",
            /*contributor_name:*/ "ds",
            /*contributor_signature:*/ "10",
        );

        await snooze(snooze_ms);
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ "ri",
            /*contributor_name:*/ "ri",
            /*contributor_signature:*/ "11",
        );

        await snooze(snooze_ms);
    });
    describe.only('Get contributor name.', function () {
      it("Should do something", async () => {
        const user  = await getGithubUser();
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
});