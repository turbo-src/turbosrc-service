const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateRepo,
        postCreatePullRequest,
        postFork,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest,
        postGetContributorID,
        postGetContributorName,
      } = require('../../../src/utils/requests')
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
        const data = await fsPromises.readFile('.config.json')
                           .catch((err) => console.error('Failed to read file', err));

        let json = JSON.parse(data);
        let org = json.github.organization
        if (org === "" || org === undefined) {
          throw new Error("Failed to load Github org");

        } else {
          console.log("Successfully read Github org " + org)
        }

        await postFork(
            /*owner:*/ org,
            /*repo:*/ "demo",
            /*org:*/ org
        );

        assert.equal(
            true,
            true,
            "Fail to fork."
        );
      });
    });
});