const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateRepo,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1500;;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('vote', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    describe('Vote duplicate with minority voter', function () {
      it("Prevent duplicate vote", async () => {
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

        //user
        await postSetVote(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ "0x18F0Ef5F737ccD11B439D52E4c4be5ed8Cd7Ca8E",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const openStatus = await postGetPRvoteStatus(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        //user
        await postSetVote(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ "0x18F0Ef5F737ccD11B439D52E4c4be5ed8Cd7Ca8E",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const duplicateStatus = await postGetPRvoteStatus(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );

        // Close vote otherwise other tests on same server instance won't work.
        // Only one vote round at a time.
        await snooze(snooze_ms);
        //mary
        await postSetVote(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor_id:*/ "0x09EAF54C0fc9F2b077ebC96e3FeD47051f7fb626",
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        const mergeStatus = await postGetPRvoteStatus(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_3",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );

        //console.log(status)
        assert.equal(
            openStatus,
            "open",
            "Fail open on initial vote below quorum"
        );

        assert.equal(
            duplicateStatus,
            "open",
            "Fail keep open even though initial vote below quorum"
        );
        assert.equal(
            mergeStatus,
            "merge",
            "Fail to merge even though voted in."
        );
      });
    });
});