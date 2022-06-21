const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
        postGetPRvoteStatus,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postGetPRvoteTotals,
        postCreateRepo,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1500;;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Voting.', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe('Two voters vote - exceed quorum.', function () {
      it("Should close open and close vote, then merge.", async () => {
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

        await snooze(snooze_ms);
        //user
        await postSetVote(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor:*/ "0x18F0Ef5F737ccD11B439D52E4c4be5ed8Cd7Ca8E",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteYesTotals = await postGetPRvoteYesTotals(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const voteNoTotals = await postGetPRvoteNoTotals(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );
        const voteTotals = await postGetPRvoteTotals(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const openStatus = await postGetPRvoteStatus(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        //mary
        await postSetVote(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "0x09EAF54C0fc9F2b077ebC96e3FeD47051f7fb626",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const mergeStatus = await postGetPRvoteStatus(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor_id:*/ "mary",
            /*side:*/ "yes",
        );

        //console.log(status)
        assert.equal(
            voteYesTotals,
            '33999',
            "Fail to add votes yes."
        );
        assert.equal(
            voteNoTotals,
            '0',
            "Fail to add votes no."
        );
        assert.equal(
            voteTotals,
            '0.033999',
            "Fail to add votes no."
        );
        assert.equal(
            openStatus,
            "open",
            "Fail to stay open."
        );

        assert.equal(
            mergeStatus,
            "merge",
            "Fail to merge even though it was voted in."
        );
      });
    });
});