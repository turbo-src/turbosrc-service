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
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*contributor_id:*/ user,
            /*contributor_name:*/ user,
            /*contributor_signature:*/ "456",
        );

        await snooze(snooze_ms);
        //await postCreateRepo(
        //    /*owner:*/ user,
        //    /*repo:*/ "demo",
        //    /*pr_id:*/ "issue_1",
        //    /*contributor:*/ user,
        //    /*side:*/ "yes",
        //);

        //await snooze(snooze_ms);
        //await postNewPullRequest(
        //    /*owner:*/ user,
        //    /*repo:*/ "demo",
        //    /*pr_id:*/ "issue_1",
        //    /*contributor:*/ user,
        //    /*side:*/ "yes",
        //);
        //await snooze(snooze_ms);
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