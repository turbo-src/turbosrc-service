const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
        postGetPRvoteStatus,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postCreateRepo,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote.', function () {
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

        await postSetVote(
            /*owner:*/ user,
            /*repo: */ "demo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "0x09EAF54C0fc9F2b077ebC96e3FeD47051f7fb626",
            /*side:*/ "yes",
        );

    });
    describe.only('A single majority voter votes.', function () {
      it("Should close vote and then merge.", async () => {
        await snooze(snooze_ms);
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

        const status = await postGetPRvoteStatus(
            /*owner:*/ user,
            /*repo: */ "demo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteYesTotals = await postGetPRvoteYesTotals(
            /*owner:*/ user,
            /*repo: */ "demo",
            /*pr_id:*/ "issue_2",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteNoTotals = await postGetPRvoteNoTotals(
            /*owner:*/ user,
            /*repo: */ "demo",
            /*pr_id:*/ "issue_2",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

        //console.log(status)

        assert.equal(
            status,
            "merge",
            "Fail to stay close even though it was voted in."
        );

        assert.equal(
            voteYesTotals,
            "0",
            "Fail to add votes yes."
        );
        assert.equal(
            voteNoTotals,
            "0",
            "Fail to zero out voteNoTotals after vote close."
        );
      });
    });
});