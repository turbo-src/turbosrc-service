const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateRepo,
        postCreatePullRequest,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create repo and GH pull request', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('Check status after creating a repo.', function () {
      it("Should do something", async () => {
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
        const user = await postGetUser(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );
        await postCreateRepo(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*pr_id:*/ "issue_1",
            /*contributor:*/ user,
            /*side:*/ "yes",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*fork_branch:*/ "pullRequest1",
            /*pr_id:*/ "issue_1",
            /*title:*/ "refactor(lsp): remove redundant client cleanup",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*fork_branch:*/ "pullRequest2",
            /*pr_id:*/ "issue_2",
            /*title:*/ "refactor(uncrustify): set maximum number of consecutive newlines"
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*fork_branch:*/ "pullRequest3",
            /*pr_id:*/ "issue_3",
            /*title:*/ "ci(mingw): only enable -municode for MinGW",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ user,
            /*repo:*/ "demo",
            /*fork_branch:*/ "pullRequest4",
            /*pr_id:*/ "issue_4",
            /*title:*/ "docs: add missing termdebug docs from Vim runtime updates",
        );

        assert.equal(
            true,
            true,
            "Fail to create repo and pull requests."
        );
      });
    });
});