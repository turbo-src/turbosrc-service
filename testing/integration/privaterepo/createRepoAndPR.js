const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateUser,
        postCreateRepo,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 5000

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));


describe('Create repo', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
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
        const user  = await getGithubUser();

        //Gets it from .config.json
        await postCreateUser(
            /*owner:*/ "",
            /*repo:*/ "",
            /*pr_id:*/ "",
            /*contributor:*/ "",
            /*side:*/ "",
        );

        await snooze(snooze_ms);
        await postCreateRepo(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );

        await snooze(snooze_ms);
        await postNewPullRequest(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
    });
    describe.only('Check status after creating a repo.', function () {
      it("Should do something", async () => {
        await snooze(snooze_ms);
        const status = await postGetPRvoteStatus(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            status,
            "open",
            "Fail to stay open even the votes are below the quorum"
        );
      });
    });
});