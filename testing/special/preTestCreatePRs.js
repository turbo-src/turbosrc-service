const assert = require('assert');
const {
        postCreateRepo,
        postCreatePullRequest,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest
      } = require('../../graphQLrequests')
const { Parser } = require('graphql/language/parser');
const fsPromises = require('fs').promises;

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

async function readDBfile(file) {
    const data = await fsPromises.readFile(file)
                       .catch((err) => console.error('Failed to read file', err));

    return data
}

describe('Create repo and GH pull request', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('Check that db server and deprecated server output is the same.', function () {
      it("Should have the same database after creating repo", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-create-repo.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-create-repo.json')

        assert.equal(
            testDBdata.toString(),
            deprecatedDBdata.toString()
        )
      });
      it("Should have the same database after creating token supply", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-create-repo.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-create-token-supply.json')

        assert.equal(
            testDBdata.toString(),
            deprecatedDBdata.toString()
        )
      });
    });
});