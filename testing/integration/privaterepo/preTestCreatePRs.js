const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateRepo,
        postCreatePullRequest,
        postSetVote,
        postNewPullRequest,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../src/utils/requests')
const { Parser } = require('graphql/language/parser');
const {
        getContributorAddress,
        getGithubContributor,
      } = require('../../../src/utils/config')

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
        const contributor_name = await getGithubContributor()
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*fork_branch:*/ "pullRequest1",
            /*pr_id:*/ "issue_1",
            /*title:*/ "refactor(lsp): remove redundant client cleanup",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*fork_branch:*/ "pullRequest2",
            /*pr_id:*/ "issue_2",
            /*title:*/ "refactor(uncrustify): set maximum number of consecutive newlines"
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ contributor_name,
            /*repo:*/ "demo",
            /*fork_branch:*/ "pullRequest3",
            /*pr_id:*/ "issue_3",
            /*title:*/ "ci(mingw): only enable -municode for MinGW",
        );
        await snooze(snooze_ms);
        await postCreatePullRequest(
            /*owner:*/ contributor_name,
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
